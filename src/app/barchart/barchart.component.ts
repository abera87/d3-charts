import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { map, schemeSet3 } from 'd3';
import { Button } from 'protractor';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {

  constructor() { }

  private svg: any;
  private canvas: any;
  private graph: any;
  private barchartData: any;
  private yScale: any;
  private xScale: any;
  private svgHeight: number = 400;
  private svgWidth: number = 500;
  private graphHeight: number;
  private graphWidth: number;
  private margine = { top: 40, right: 100, buttom: 30, left: 30 };

  ngOnInit(): void {
    this.graphHeight = this.svgHeight - this.margine.top - this.margine.buttom;
    this.graphWidth = this.svgWidth - this.margine.left - this.margine.right;

    this.getData();
    this.buildSVG();
    this.drawBarChart();
  }

  private getData() {
    this.barchartData = [
      { "Skill": "C#", "Rating": 8 },
      { "Skill": "MSBI", "Rating": 5 },
      { "Skill": "CSS", "Rating": 4 },
      { "Skill": "SQL Server", "Rating": 7 },
      { "Skill": "Azure", "Rating": 6.5 },
      { "Skill": ".Net Core", "Rating": 7.5 },
      { "Skill": "Angular", "Rating": 7 }
    ]
  }

  private buildSVG() {
    this.canvas = d3.select('.canvas');

    this.svg = this.canvas.append('svg')
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);
  }

  private drawBarChart() {
    // this is for background color       
    this.svg.append('rect')
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight)
      .attr("fill", "rgb(230, 228, 228)");

    // this is for title
    this.svg.append('text')
      .attr("x", (this.svgWidth / 2))
      .attr("y", this.margine.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("text-decoration", "underline")
      .text("Skill vs Rating Graph")
      .attr("fill", "Black");



    // this is main graph ploting area
    this.graph = this.svg.append('g')
      .attr("width", this.graphWidth)
      .attr("height", this.graphHeight)
      .attr("transform", `translate(${this.margine.left} ${this.margine.top})`);

    const xAxisGroup = this.graph.append('g');
    const yAxisGroup = this.graph.append('g');


    const rect = this.graph.selectAll('rect');// this.svg.append('rect');
    //const rectAll=d3.selectAll('rect');
    //color scale
    const colorScale = d3.scaleOrdinal(d3["schemeSet1"]);
    colorScale.domain(this.barchartData.map(item => item.Skill));
    // y scale
    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(this.barchartData, d => (+d["Rating"])) + ((d3.max(this.barchartData, d => (+d["Rating"]))) * 0.25)])
      .range([this.graphHeight, 0]);

    this.xScale = d3.scaleBand()
      .domain(this.barchartData.map(item => item.Skill))
      .range([0, this.graphWidth])
      .paddingInner(0.1);

    const xAxis = d3.axisBottom(this.xScale);
    const yAxis = d3.axisLeft(this.yScale);

    xAxisGroup.call(xAxis)
      .attr("transform", `translate(0 ${this.graphHeight})`);

    yAxisGroup.call(yAxis);

    rect.data(this.barchartData)
      .enter().append('rect')
      .on("mouseover", function (d, i, n) {
        d3.select(n[i])
          .transition()
          .delay(50)
          .style("opacity", 0.7);
      })
      .on("mouseout", function (d, i, n) {
        d3.select(n[i])
          .transition()
          .delay(70)
          .style("opacity", 1);
      })
      .transition()
      .attr("y", d => this.yScale(d.Rating))
      .delay(function (d, i) {
        return i * 300;
      })
      .ease(d3.easeBounceIn)
      .attr("width", this.xScale.bandwidth)
      .attr("height", (d, i) => this.graphHeight - this.yScale(d.Rating))
      .attr("x", d => this.xScale(d.Skill))
      // .attr("y",d=> this.yScale(d.Rating))
      .attr("fill", d => colorScale(d.Skill));

    // this is for legend
    const legendGroup = this.svg.append('g');

    //legendGroup.attr("transform",`translate(${this.graphWidth} ${this.margine.top})`);

    legendGroup.selectAll('circle')
                .data(this.barchartData)
                .enter().append('circle')
                .attr("cx",this.svgWidth-this.margine.right+20)
                .attr("cy",(d,i)=> (this.margine.top*2/3+10 + i*20))
                .attr("r",7)
                .attr("fill",d => colorScale(d.Skill));

    legendGroup.selectAll('text')
                .data(this.barchartData)
                .enter().append('text')
                .attr("x",this.svgWidth-this.margine.right+30)
                .attr("y",(d,i)=> (this.margine.top*2/3+14 + i*20))
                .attr("fill",d=>colorScale(d.Skill))
                .text(d=>d.Skill)
                .attr("text-anchor","left");

  }

}
