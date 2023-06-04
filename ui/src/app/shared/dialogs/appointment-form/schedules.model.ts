export class Schedules {
    constructor(
        public scheduledSendTime: string,
        public message: string,
        public phoneNumber: string,
        public mother?: string,
    ){}
}