export class cashbookModel {

    constructor(
        public patient_id: string,
        public head_id: string,
        public type: string,
        public description: string, public amount: string, public refund: string,
        public doctor_id: string, public user_id: string, public clinic: string) {

    }


}