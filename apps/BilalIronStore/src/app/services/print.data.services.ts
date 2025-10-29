import { Injectable } from "@angular/core";
import { ReportConfig, ReportTemplate } from "../models/report.models";
import { ReportConfigService } from "./report-config.service";

@Injectable({
  providedIn: 'root'
})
export class PrintDataService {
  public PrintData: any = {};

  constructor(private configService: ReportConfigService) {}

  public getTitle(cols: any) {
    const colArr: any = [];
    Object.keys(cols).forEach(k => {
      colArr.push(cols[k].title);
    });
    return colArr;
  }

  // Enhanced method to prepare report data
  public prepareReportData(
    title: string,
    subTitle: string,
    data: any[],
    columns: any[],
    customerName?: string,
    template: ReportTemplate = ReportTemplate.STANDARD
  ): ReportConfig {

    const baseConfig = this.configService.getDefaultConfig();
    const templateConfig = this.configService.getTemplateConfig(template);

    const tableConfig = this.configService.convertDynamicTableToConfig(
      { Columns: columns },
      data
    );

    const reportConfig: Partial<ReportConfig> = {
      title,
      subTitle,
      customerName,
      ...tableConfig
    };

    return this.configService.mergeConfigs(
      this.configService.mergeConfigs(baseConfig, templateConfig),
      reportConfig
    );
  }

  // Method to prepare data from ft-dynamic-table
  public prepareFromDynamicTable(
    tableElement: HTMLElement,
    title: string,
    subTitle?: string,
    customerName?: string
  ): void {
    this.PrintData = {
      HTMLData: tableElement,
      Title: title,
      SubTitle: subTitle,
      CustomerName: customerName
    };
  }

  // Clear print data
  public clearData(): void {
    this.PrintData = {};
  }
}

