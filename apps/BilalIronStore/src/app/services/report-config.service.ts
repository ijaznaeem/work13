import { Injectable } from '@angular/core';
import { ReportConfig, ReportTemplate, TableColumn } from '../models/report.models';

@Injectable({
  providedIn: 'root'
})
export class ReportConfigService {

  getDefaultConfig(): ReportConfig {
    return {
      title: '',
      pageSize: 'A4',
      orientation: 'portrait',
      headerConfig: {
        showLogo: true,
        businessName: '',
        address: '',
        phone: ''
      },
      tableConfig: {
        columns: [],
        data: [],
        showSummary: false,
        styling: {
          headerBackgroundColor: '#f8f9fa',
          headerTextColor: '#000000',
          borderColor: '#000000',
          fontSize: 8,
          cellPadding: 0.5
        }
      },
      footerConfig: {
        showPageNumbers: true,
        showDateTime: true
      },
      exportOptions: {
        formats: ['pdf'],
        pdfOptions: {
          margins: { top: 5, left: 3, right: 3, bottom: 5 },
          fontSize: 8,
          lineHeight: 1.2
        }
      }
    };
  }

  getTemplateConfig(template: ReportTemplate): Partial<ReportConfig> {
    switch (template) {
      case ReportTemplate.LEDGER:
        return {
          title: 'Ledger Report',
          tableConfig: {
            columns: [],
            data: [],
            showSummary: true,
            styling: {
              headerBackgroundColor: '#e9ecef',
              fontSize: 9
            }
          }
        };

      case ReportTemplate.INVOICE:
        return {
          title: 'Invoice',
          headerConfig: {
            showLogo: true,
            customFields: [
              { label: 'Invoice No:', value: '', position: 'right' },
              { label: 'Date:', value: '', position: 'right' }
            ]
          }
        };

      case ReportTemplate.SUMMARY:
        return {
          title: 'Summary Report',
          tableConfig: {
            columns: [],
            data: [],
            showSummary: true,
            styling: {
              headerBackgroundColor: '#d1ecf1',
              fontSize: 10
            }
          }
        };

      default:
        return this.getDefaultConfig();
    }
  }

  mergeConfigs(baseConfig: ReportConfig, overrides: Partial<ReportConfig>): ReportConfig {
    return {
      ...baseConfig,
      ...overrides,
      headerConfig: { ...baseConfig.headerConfig, ...overrides.headerConfig },
      tableConfig: {
        ...baseConfig.tableConfig,
        ...overrides.tableConfig,
        columns: overrides.tableConfig?.columns || baseConfig.tableConfig?.columns || [],
        data: overrides.tableConfig?.data || baseConfig.tableConfig?.data || []
      },
      footerConfig: { ...baseConfig.footerConfig, ...overrides.footerConfig },
      exportOptions: { ...baseConfig.exportOptions, ...overrides.exportOptions }
    };
  }

  // Convert ft-dynamic-table settings to report config
  convertDynamicTableToConfig(settings: any, data: any[]): Partial<ReportConfig> {
    const columns: TableColumn[] = settings.Columns.map((col: any) => ({
      label: col.label,
      field: col.fldName,
      align: 'left',
      sum: col.sum || false,
      visible: true
    }));

    return {
      tableConfig: {
        columns,
        data,
        showSummary: columns.some(col => col.sum)
      }
    };
  }
}
