import { ITask } from '@twilio/flex-ui';
import Reservation from 'types/Reservation';
import { EncodedParams } from 'types/Params';
import ApiService from './ApiService';

export interface ParticipantResponse {
  success: boolean;
  callSid: string;
}

export interface RemoveParticipantResponse {
  success: boolean;
}

class InternalCallService extends ApiService {
  _toggleParticipantHold = async (conference: string, participantSid: string, hold: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conference),
        participant: encodeURIComponent(participantSid),
        hold: encodeURIComponent(hold),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<ParticipantResponse>(`${this.serverlessDomain}/voice/hold-participant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      })
        .then((response: ParticipantResponse) => {
          console.log(`${hold ? 'Hold' : 'Unhold'} successful for participant`, participantSid);
          resolve(response.callSid);
        })
        .catch((error) => {
          console.error(`Error ${hold ? 'holding' : 'unholding'} participant ${participantSid}\r\n`, error);
          reject(error);
        });
    });
  };

  holdParticipant = (conference: string, participantSid: string): Promise<string> => {
    return this._toggleParticipantHold(conference, participantSid, true);
  };

  unholdParticipant = (conference: string, participantSid: string): Promise<string> => {
    return this._toggleParticipantHold(conference, participantSid, false);
  };

  acceptInternalTask = async (reservation: Reservation, taskSid: string) => {
    if (typeof reservation.task.attributes.conference !== 'undefined') {
      reservation.call(
        reservation.task.attributes.from,
        `${this.serverlessDomain}/voice/agent-join-conference?conferenceName=${reservation.task.attributes.conference.friendlyName}`,
        {
          accept: true,
        },
      );
    } else {
      reservation.call(
        reservation.task.attributes.from,
        `${this.serverlessDomain}/voice/agent-outbound-join?taskSid=${taskSid}`,
        {
          accept: true,
        },
      );
    }
  };

  rejectInternalTask = async (task: ITask) => {
    await (task.sourceObject as Reservation).accept();
    await task.wrapUp();
    await task.complete();

    return new Promise((resolve, reject) => {
      const taskSid = task.attributes.conferenceSid;

      const encodedParams = {
        taskSid,
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject(`${this.serverlessDomain}/voice/cleanup-rejected-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      })
        .then((response) => {
          console.log('Outbound call has been placed into wrapping');
          resolve(response);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };
}

const internalCallService = new InternalCallService();

export default internalCallService;
