import {Injectable} from '@angular/core'

@Injectable()
export class PateintService {

    private patient: any = {};   


    public Patient():any {
        return this.patient;
    }
public setpatient(patient: any) {
    this.patient = patient;
}
}
