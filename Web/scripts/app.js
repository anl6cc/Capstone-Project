// something to fix for later:
// make it start on heart instead of not on anything

// allowing any series to be dragged no matter the option but need to know which line is being dragged
// I DID IT YAYYYY I'M SUCCESSFUL

// working on having the area thing at the bottom yayy

// got the area thing working. whichever option is chosen will have the range of stuff displayed at the bottom of the screen

// let's have the thing plot the line yay

// ok i did

// but for some reason it's getting the middle one when you swtich instead of getting the minimum. walp
// also gotta make it update more often

// variables for the plot
var plot1;
var plot2;
var plot3;
var xClick;
var yClick;

//global variables
var lines = [];
var current = 0;

var choice = 0;
var organs = ['Heart', 'Left Lung', 'Right Lung', 'Esophagus'];
var colors = ['#00AAFF', '#FF9933', '#333333', '#666666'];

var rangeLines = [];
var maxLine = [];
var minLine = [];

// -------------------------------------------------------------------------------------------------------------
// Read in patient files

// read in the DDVH file
function readTextFile(file)
{
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
              // if everything is good then obtain the string and initialize the array for plotting
              var dataString = rawFile.responseText;
              return initialize(dataString);
          }
      }
      return [];
  }
  rawFile.send(null);

  // return what is returned when the file reading is complete
  return rawFile.onreadystatechange.call();
}

// read the data from the text file string to obtain an array to pass to jqplot
function initialize(dataString)
{
  var lines = dataString.split("\n");
  var num = parseInt(lines[0], 10); // obtain the number of data points

  s1 = [];
  
  // build the array for jqplot
  for(var i=1; i < num + 1; i++)
  {
    var pos = lines[i].split(" ");
    s1.push([parseFloat(pos[0]), parseFloat(pos[1])]);
  }

  // return the dose array and the volume array
  return s1;
}

// ------------------------------------------------------------------------------------------------------------
// Create the plot using jqplot

// after reading all files generate the plot given the data points and options to move only in the y direction
// only plots for Chart 1
function plot(all, seriesOptions)
{   
    // generate the jqplot
    plot1 = $.jqplot('chart1', all,{
    title: 'Volume vs Dose',
     axes: {
        xaxis:{
          label:'Dose (cGy)',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
          min: 0,
          tickOptions: {
              mark: 'inside'
          }
        },
        yaxis:{
          label:'Relative Volume',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
          pad: 1.0,
          tickOptions: {
              mark: 'inside'
          }
        }
     },
    highlighter: {
         sizeAdjust: 10,
         tooltipLocation: 'n',
         tooltipAxes: 'y',
         tooltipFormatString: '<b><i><span style="color:red;">cDVH</span></i></b> %.2f',
         useAxesFormatters: false
     },
     cursor: {
         show: true
     },
    legend: {
        show: true,
        renderer: $.jqplot.EnhancedLegendRenderer,
        location: 'w' ,
        placement : "outside",
        marginRight: '100px',
        rendererOptions: {
            numberColumns: 1
        },
        seriesToggle: true
      },
    series: seriesOptions
  });
}

//-----------------------------------------------------------------------------------------------------------------
// Plot graph

function readGraphs(){

  for(var i=0; i<organs.length; i++)
  {
    lines[i] = [];
  }

  // read in the patient files
  lines[0].push(readTextFile("./patient_data/LungDVHAD/heart/4-beam_Esop.heart.ddvh")); // bottom
  lines[1].push(readTextFile("./patient_data/LungDVHAD/left_lung/4-beam_Esop.L_lung.ddvh"));
  lines[2].push(readTextFile("./patient_data/LungDVHAD/right_lung/4-beam_Esop.R_lung.ddvh"));
  lines[3].push(readTextFile("./patient_data/LungDVHAD/esophagus/4-beam_Esop.esophagus.ddvh"));

  lines[0].push(readTextFile("./patient_data/LungDVHAD/heart/9-beam_Esop.heart.ddvh")); // top
  lines[1].push(readTextFile("./patient_data/LungDVHAD/left_lung/9-beam_Esop.L_lung.ddvh"));
  lines[2].push(readTextFile("./patient_data/LungDVHAD/right_lung/9-beam_Esop.R_lung.ddvh"));
  lines[3].push(readTextFile("./patient_data/LungDVHAD/esophagus/9-beam_Esop.esophagus.ddvh"));

  lines[0].push(readTextFile("./patient_data/LungDVHAD/heart/38-beamNCP_Esop.heart.ddvh")); // middle
  lines[1].push(readTextFile("./patient_data/LungDVHAD/left_lung/38-beamNCP_Esop.L_lung.ddvh"));
  lines[2].push(readTextFile("./patient_data/LungDVHAD/right_lung/38-beamNCP_Esop.R_lung.ddvh"));
  lines[3].push(readTextFile("./patient_data/LungDVHAD/esophagus/38-beamNCP_Esop.esophagus.ddvh"));

  for(var i=0; i<organs.length; i++)
  {
    rangeLines[i] = [];
  }

  for(var i=0; i<lines[0].length; i++)
  {
    for(var j=0; j<rangeLines.length; j++)
    {
      rangeLines[j].push(convert(lines[j][i]));
    }
  }

  for(var i=0; i<organs.length; i++)
  {
    maxLine[i] = [];
    minLine[i] = [];
  }

  for(var i=0; i<lines.length; i++)
  {
    for(var j=0; j<lines[0].length; j++)
    {
      for(var k=0; k<lines[0][0].length; k++)
      {
        if(maxLine[i].length < lines[0][0].length)
        {
          maxLine[i].push(rangeLines[i][j][k]);
        }
        else if(rangeLines[i][j][k] > maxLine[i][k])
        {
          maxLine[i][k] = rangeLines[i][j][k];
        }
        if(minLine[i].length < lines[0][0].length)
        {
          minLine[i].push(rangeLines[i][j][k]);
        }
        else if(rangeLines[i][k] < minLine[i][j][k])
        {
          minLine[i][k] = rangeLines[i][j][k];
        }
      }
    }
  }
}

// choose a plan to load to display on the graph
function loadGraph (index){
  // convert to cumulative
  var converted = [];
  converted.push(convert(lines[0][index]));
  converted.push(convert(lines[1][index]));

  // argument to be passed to plot the data
  var arg = [converted[0], converted[1]];

  // generate an array to pass in series options for all data sets
  var series = [];
  var seriesName = ['Heart', 'Lung'];
  for(var i=0; i<arg.length; i++)
  {
    series.push({
      dragable: {
          color: '#ff3366',
          constrainTo: 'y'
      },
      markerOptions: {
        show: false,
        size: 2
     },
     label: seriesName[i]
    });
  }

  /////////////
  //BAR CHART//
  /////////////
  var heartPRP = returnPRP(converted[0]);
  var lungPRP = returnPRP(converted[1]);

  plot2 = $.jqplot('chart2', [[['Heart', heartPRP], ['Lung', lungPRP]]], {
      seriesDefaults: {
          renderer:$.jqplot.BarRenderer,
          pointLabels: { show: true },
          rendererOptions: {
                varyBarColor: true
            }
      },
      axes: {
          xaxis: {
              renderer: $.jqplot.CategoryAxisRenderer
          },
          yaxis:{
            label:'NTCP',
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
            min: 7,
            max: 9
          }
      }
  });

  // Range of Stuff
  var range = [maxLine[choice], minLine[choice], converted[choice]];

  // add another one for new line
  series.push({
      dragable: {
          color: '#ff3366',
          constrainTo: 'y'
      },
      markerOptions: {
        show: false,
        size: 2
     },
     label: 'Blah'
    });

  // generate the jqplot
  plot3 = $.jqplot('chart3', range, {
    title: 'Treatment Range of '+organs[choice],
    seriesColors: [colors[choice], colors[choice], '#000000'],
    axesDefaults: {
      pad: 1.05
    },
    fillBetween: {
      series1: 0,
      series2: 1,
      color: colors[choice],
      baseSeries: 0,
      fill: true
    },
    axes: {
        xaxis:{
          label:'Dose (cGy)',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
          min: 0,
          tickOptions: {
              mark: 'inside'
          }
        },
        yaxis:{
          label:'Relative Volume',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
          pad: 1.0,
          tickOptions: {
              mark: 'inside'
          }
        }
     },
    seriesDefaults: {
      rendererOptions: {
        smooth: true
      }
    },
    series: series
  });


  // switch the Plugins on and off based on the chart being plotted
  $.jqplot.config.enablePlugins = true;
  // plot the data for the line chart
  plot(arg, series);
  // replot the data so graphs don't stack
  plot1.replot();
  $.jqplot.config.enablePlugins = false;
  plot2.replot();
  plot3.replot();
}

//--------------------------------------------------------------------------------------------------------
// Utility Methods

// convert the data from dvh volume to cdvh volume
// uses method from Watkin's python program
function convert(data)
{
  var dose = [];
  var volume = [];
  var total_volume = 0;
  for(var i=0; i<data.length; i++)
  {
    dose.push(data[i][0]);
    volume.push(data[i][1]);
    total_volume += data[i][1];
  }

  totalData = [];
  for(var i=data.length-1; i>-1; i--)
  {
    var sum = volume.slice(0,i).reduce(function(a, b) { return a + b; }, 0);
    totalData[i] = [dose[i], 1 - sum/total_volume];
  }

  return totalData;
}

// return the probability in percent
function returnPRP(data)
{
  var con = -2.98;
  var c_d = 0.0356;
  var c_v = 4.13;
  var c_v2 = -5.18;
  var c_d2 = -0.000727;
  var c_dv = 0.221;
  var PRPSum = 0;
  var PRP = [];
  for(var i=data.length-1; i>-1; i--)
  {
      var dose = data[i][0];
      var volume = data[i][1];
      var expFactor = con + c_d * dose + c_v * volume + c_d2 * Math.pow(dose, 2) + c_v2 * Math.pow(volume, 2) + c_dv * dose*volume;
      PRP[i] = 1 / (1 + Math.log(-1.0*expFactor));
      if(!isNaN(PRP[i]))
        PRPSum += PRP[i];
  }

  var PRP_Value = PRPSum / (1.15 * data.length);

  return PRP_Value * 100;
}

// ---------------------------------------------------------------------------------------------------------------
// Starting function

// on ready function
$(document).ready(function () {

  readGraphs();

  loadGraph(2);

// -------------------------------------------------------------------------------------------------------------
// Python fun

/*
  $("button").click(function(){
    $.ajax({
      type: "POST",
      url: "test.txt",
      data: "text",
      crossDomain: true,
      success: function(result) {
        console.log('hi');
        console.log(result);
      },
      error: function(result) {
        console.log('no');
        $('#alert').html("Could not read in Python file");
      }
    });
  */
/*
  $("button").click(function(){
    $.ajax('scripts/test.txt', {
      type: "POST",
      success: function(result) {
        console.log('hi');
        console.log(result);
      },
      error: function(result) {
        console.log('no');
        $('#alert').html("Could not read in Python file");
      }
    });
  });
*/

/*
$("button").click(function(){
  $.get("test.txt", function(data, status){
    console.log('hi');
    console.log(data);
  });
});
*/

//---------------------------------------------------------------------------------------------------------------
// Highlight and Click Methods

/*
  $('#chart2').bind('jqplotDragStart', 
  function (seriesIndex, pointIndex, pixelposition, data) {
      //console.log(data);
      xClick = data.x;
      yClick = data.y;
  });*/

  $('#chart1').bind('jqplotDragStart', 
  function (seriesIndex, pointIndex, pixelposition, data) {
      current = pointIndex;
      xClick = data.x;
      yClick = data.y;
  });

// adjust the graph according to the end of the drag
$('#chart1').bind('jqplotDragStop',
function (seriesIndex, pointIndex, pixelposition, data) {
  //console.log(JSON.stringify(pixelposition));
  //console.log(pixelposition);

  // does either heart or lung based on the curret one pressed
  // convert to cumulative
  var converted = [];
  for(var i=0; i<lines[current].length; i++)
  {
    converted[i] = convert(lines[current][i]);
  }

  var xDist = [10000, 10000, 10000];
  var xPt = [-1, -1, -1];

  // gets closest x pt to dragged x pt for each graph
  for(var i=0; i<converted.length; i++)
  {
    var dist;
    for(var j=0; j<converted[i].length; j++)
    {
      dist = Math.abs(converted[i][j][0] - pixelposition.xaxis);
      if(dist < xDist[i])
      {
        xDist[i] = dist;
        xPt[i] = j;
      }
    }
  }

  var minDist = [10000, 10000, 10000];
  //console.log("xPt: "+xPt);

  // gets the y dist for each at that x pt
  for(var i=0; i<converted.length; i++)
  {
    //console.log(JSON.stringify(converted[i][31]));
    minDist[i] = Math.abs(converted[i][xPt[i]][1] - pixelposition.yaxis);
  }

  var index = minDist.indexOf(Math.min.apply(Math, minDist));

  loadGraph(index);
}); 

  var nav = function () {
    $('.gw-nav > li > a').click(function () {
      var gw_nav = $('.gw-nav');
      gw_nav.find('li').removeClass('active');

      var checkElement = $(this).parent();
      var id = checkElement.attr('id');
      if(id == 1){
        choice = 0;
        loadGraph(1);
        console.log("HEART");
      }
      else if (id == 2){
        choice = 1;
        loadGraph(2);
        console.log("LEFT LUNG");
      } 
      else if (id == 3){
        choice = 2;
        loadGraph(2);
        console.log("RIGHT LUNG");
      }
      else {
        choice = 3;
        loadGraph(0);
        console.log("ESOPHAGUS");
      }
      var ulDom = checkElement.find('.gw-submenu')[0];

      if (ulDom == undefined) {
          checkElement.addClass('active');
          return;
      }   
    });
  };
  nav();

});