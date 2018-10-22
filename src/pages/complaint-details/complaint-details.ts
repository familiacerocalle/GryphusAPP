import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Complaint} from "../../providers/models/Complaint";
import {User} from "../../providers/models/User";
import {ComplaintType} from "../../providers/models/ComplaintType";
import {ShWeb} from "../../providers/sh-web/sh_web";
import {ComplaintEditPage} from "../complaint-edit/complaint-edit";
import {ShUtils} from "../../providers/utils/ShUtils";

/**
 * Generated class for the ComplaintDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
    selector: 'page-complaint-details',
    templateUrl: 'complaint-details.html',
    providers: [ShWeb]
})
export class ComplaintDetailsPage {
    user: User;
    complaint: Complaint = new Complaint();
    complaintList: Complaint[] = [];
    complaintTypeList: ComplaintType[] = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private shWeb: ShWeb) {
        this.user = this.navParams.get("user");
        this.complaintList = this.navParams.get("complaintList");
        this.complaintTypeList = this.navParams.get("complaintTypeList");

        if (this.navParams.get("complaint") != null) {
            this.complaint = this.navParams.get("complaint");
        } else {
            this.editComplaint();
        }

        if (this.complaint.attachments == null) {
            this.complaint.attachments = [];
        }
    }

    saveComplaint() {
        this.complaint.user_id = this.user.id;
        if (this.complaint.id == null) {
            let request: any = {};
            request.complaint = this.complaint;
            if (this.complaint.attachments != null && this.complaint.attachments.length > 0) {
                request.complaint.files = this.complaint.attachments;
                this.complaint.attachments = null;
            }
            this.shWeb.post("complaints", request).then((complaint: Complaint) => {
                ShUtils.saveUnique(this.complaintList, this.complaint);
                this.complaint = complaint;
            });
        } else {
            let request: any = {};
            request.complaint = this.complaint;

            if (this.complaint.attachments != null && this.complaint.attachments.length > 0) {
                request.complaint.files = this.complaint.attachments;
                this.complaint.attachments = null;
            }
            this.shWeb.put("complaints/" + this.complaint.id, request).then((complaint: Complaint) => {
                this.complaint = complaint;
            });
        }
    }

    editComplaint() {
        this.navCtrl.push(ComplaintEditPage, {
            complaint: this.complaint,
            user: this.user,
            complaintTypeList: this.complaintTypeList
        })
    }
}
