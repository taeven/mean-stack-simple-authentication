import { Component, OnInit } from '@angular/core';
import { reportsData } from '../../assets/compliance.json';
import { stringify } from 'querystring';
import { ThrowStmt } from '@angular/compiler';
import { UserService } from '../services/user.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public overallPerformance = [0, 0, 0];
  public reports = new Map<string, any>();
  public categories = [];
  constructor(private userService: UserService, private router: Router) {
    for (var report in reportsData) {
      // console.log(reportsData[report]);

      for (var cat of reportsData[report].ReportCategorys.split(',')) {
        var { performance, total } = this.getPerformance(
          reportsData[report].ReportPerformanceCount_180,
        );

        reportsData[report].performance = performance;
        reportsData[report].totalPerf = total;
        cat = cat == '' ? 'Uncatagorized' : cat.replace(/(<([^>]+)>)/gi, '');
        if (this.reports.get(cat)) {
          this.reports.get(cat).report.push(reportsData[report]);
        } else {
          this.reports.set(cat, { report: [reportsData[report]] });
        }
      }
    }
    this.getCategories();
    console.log(this.reports.get('Uncatagorized'));
  }

  public logout() {
    this.userService.logout().subscribe(data => {
      console.log(data);
      if (data.message.includes('logged out')) {
        this.router.navigateByUrl('/login');
      }
    });
  }
  public getCategoryPerformance(cat) {
    var total = 0;
    var performance = [0, 0, 0];

    for (var v of this.reports.get(cat).report) {
      for (var i in v.performance) {
        performance[i] += v.performance[i];
      }
    }
    for (var i in performance) {
      this.overallPerformance[i] += performance[i];
    }

    total = this.normalizePerformance(performance);

    this.reports.get(cat).total = total;
    this.reports.get(cat).performance = performance;
  }

  public normalizePerformance(performance) {
    var total = 0;
    for (var p of performance) {
      total += p;
    }
    for (var i in performance) {
      performance[i] = Math.round(
        total == 0 ? 0 : (performance[i] * 100) / total,
      );
    }
    return total;
  }
  public getPerformance(perfString) {
    var performance = [];
    var total = 0;
    for (var p of perfString.split(',')) {
      performance.push(Number(p));
    }

    total = this.normalizePerformance(performance);
    return { performance, total };
  }
  public getCategories() {
    this.reports.forEach((v, k) => {
      this.categories.push(k);
      this.getCategoryPerformance(k);
    });
    this.normalizePerformance(this.overallPerformance);
    // for (var cat in this.reports) {
    // cat = cat == '' ? 'Uncatagorized' : cat.replace(/(<([^>]+)>)/gi, '');
    //   this.categories.push(cat);
    // }
  }
  ngOnInit() {}
}
