import { createElement } from "../../shared/utils/create-element";

interface Options {
  data?: number[];
  label?: string;
  value?: number;
  link?: string;
  formatHeading?: (value: number) => string;
}

export default class ColumnChart {
  private element: HTMLElement | null;
  private data: number[];
  private label: string;
  private value: number;
  private link?: string;
  private formatHeading?: (value: number) => string;

  readonly chartHeight: number = 50;

  constructor({
    data = [],
    label = "",
    value = 0,
    link,
    formatHeading,
  }: Options = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.element = this.createElement();
  }

  private createElement(): HTMLElement {
    const isLoading = !this.data?.length;

    const html = `
      <div class="column-chart ${isLoading ? "column-chart_loading" : ""}" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header"       
            class="column-chart__header">
            ${this.formatHeading ? this.formatHeading(this.value) : this.value}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.renderColumns(this.data)}
          </div>
        </div> 
      </div>
    `;

    return createElement(html);
  }

  private getLink(): string {
    if (!this.link) {
      return "";
    }

    return `<a href="${this.link}" class="column-chart__link">View all</a>`;
  }

  private renderColumns(data: number[]): string {
    if (data.length === 0) {
      return "";
    }

    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data
      .map((item) => {
        const height = Math.floor(item * scale);
        const percent = ((item / maxValue) * 100).toFixed(0);

        return `<div style="--value: ${height}" data-tooltip="${percent}%"></div>`;
      })
      .join("");
  }

  public update(data: number[]): void {
    this.data = data;

    if (this.element) {
      const chart: HTMLElement | null = this.element.querySelector(
        '[data-element="body"]',
      );

      if (chart) {
        chart.innerHTML = `${this.renderColumns(data)}`;

        this.element.classList.toggle(
          "column-chart_loading",
          !this.data.length,
        );
      }
    }
  }

  public remove(): void {
    if (this.element) {
      this.element.remove();
    }
  }

  public destroy(): void {
    this.remove();
    this.element = null;
    this.data = [];
  }
}
