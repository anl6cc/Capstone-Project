// variables for the plot
var plot1;
var plot2;
var xClick;
var yClick;

//global variables
// var heart = []; Heart is 0
// var lung = []; Lung is 1
var lines = [];
var current = 0;

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
    title: 'Heart vs Lung',
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
  lines[0] = [];
  lines[1] = [];

  // read in the patient files
  lines[0].push(readTextFile("./patient_data/LungDVHAD/heart/4-beam_Esop.heart.ddvh")); // bottom
  lines[1].push(readTextFile("./patient_data/LungDVHAD/lung/4-beam_Esop.L_lung.ddvh"));

  lines[0].push(readTextFile("./patient_data/LungDVHAD/heart/9-beam_Esop.heart.ddvh")); // top
  lines[1].push(readTextFile("./patient_data/LungDVHAD/lung/9-beam_Esop.L_lung.ddvh"));

  lines[0].push(readTextFile("./patient_data/LungDVHAD/heart/38-beamNCP_Esop.heart.ddvh")); // middle
  lines[1].push(readTextFile("./patient_data/LungDVHAD/lung/38-beamNCP_Esop.L_lung.ddvh"));
}

// choose a plan to load to display on the graph
function loadGraph (index){
  $.jqplot.config.enablePlugins = true;

  // convert to cumulative
  var totalHeart = convert(lines[0][index]);
  var totalLung = convert(lines[1][index]);

  // argument to be passed to plot the data
  var arg = [totalHeart, totalLung];

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
  var heartPRP = returnPRP(totalHeart);
  var lungPRP = returnPRP(totalLung);

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

  // switch the Plugins on and off based on the chart being plotted
  $.jqplot.config.enablePlugins = true;
  // plot the data for the line chart
  plot(arg, series);
  // replot the data so graphs don't stack
  plot1.replot();
  $.jqplot.config.enablePlugins = false;
  plot2.replot();
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


  $('#chart2').bind('jqplotDragStart', 
  function (seriesIndex, pointIndex, pixelposition, data) {
      //console.log(data);
      xClick = data.x;
      yClick = data.y;
  });

  $('#chart1').bind('jqplotDragStart', 
  function (seriesIndex, pointIndex, pixelposition, data) {
      //console.log(data);
      xClick = data.x;
      yClick = data.y;
  });

// adjust the graph according to the end of the drag
$('#chart1').bind('jqplotDragStop',
function (seriesIndex, pointIndex, pixelposition, data) {
  //console.log(JSON.stringify(pixelposition));

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
  console.log("xPt: "+xPt);

  // gets the y dist for each at that x pt
  for(var i=0; i<converted.length; i++)
  {
    console.log(JSON.stringify(converted[i][31]));
    minDist[i] = Math.abs(converted[i][xPt[i]][1] - pixelposition.yaxis);
  }

  var index = minDist.indexOf(Math.min.apply(Math, minDist));

  //console.log(index);
  //console.log(JSON.stringify(minDist));

  totalHeart = convert(lines[0][index]);
  totalLung = convert(lines[1][index]);

  // argument to be passed to plot the data
  var arg = [totalHeart, totalLung];

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

  var heartPRP = returnPRP(totalHeart);
  var lungPRP = returnPRP(totalLung);

  plot2 = $.jqplot('chart2', [[['Heart', heartPRP], ['Lung', lungPRP]]], {
      //seriesColors:['#00749F', '#00749F'],
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

  // plot the data
  $.jqplot.config.enablePlugins = true;
  plot(arg, series);
  plot1.replot();
  $.jqplot.config.enablePlugins = false;
  plot2.replot(); 
}); 

  var nav = function () {
    $('.gw-nav > li > a').click(function () {
      var gw_nav = $('.gw-nav');
      gw_nav.find('li').removeClass('active');

      var checkElement = $(this).parent();
      var id = checkElement.attr('id');
      if(id == 1){
        current = 0;
        loadGraph(current);
        console.log("HEART");
      }
      else if (id == 2){
        current = 1;
        loadGraph(current);
        console.log("LUNG");
      } 
      else if (id == 3){
          //document.getElementById("result").innerHTML = "This is the third div.";
      }
      else {
          //document.getElementById("result").innerHTML = "This is the fourth div.";
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