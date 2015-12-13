// variables for the plot
var plot1;
var xClick;
var yClick;

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
function plot(all, seriesOptions)
{
    $.jqplot.config.enablePlugins = true;
    
    // generate the jqplot
    plot1 = $.jqplot('chart1', all,{
    title: 'Heart (blue) vs Lung (orange)',
     axes: {
        xaxis:{
          label:'Dose (divide by 100 to get dose / Gy)',
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

// choose a plan to load to display on the graph
function loadGraph (index){
  var heart = [];
  var lung = [];
   // read in the patient files
  heart.push(readTextFile("./patient_data/LungDVHAD/heart/4-beam_Esop.heart.ddvh")); // bottom
  lung.push(readTextFile("./patient_data/LungDVHAD/lung/4-beam_Esop.L_lung.ddvh"));

  heart.push(readTextFile("./patient_data/LungDVHAD/heart/9-beam_Esop.heart.ddvh")); // top
  lung.push(readTextFile("./patient_data/LungDVHAD/lung/9-beam_Esop.L_lung.ddvh"));

  heart.push(readTextFile("./patient_data/LungDVHAD/heart/38-beamNCP_Esop.heart.ddvh")); // middle
  lung.push(readTextFile("./patient_data/LungDVHAD/lung/38-beamNCP_Esop.L_lung.ddvh"));

  // convert to cumulative
  var totalHeart = convert(heart[index]);
  var totalLung = convert(lung[index]);

  // argument to be passed to plot the data
  var arg = [totalHeart, totalLung];
  //var arg = totalHeart;

  // generate an array to pass in series options for all data sets
  var series = [];
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
     }
    });
  }

  // plot the data for the line chart
  plot(arg, series);

  /////////////
  //BAR CHART//
  /////////////
  var heartPRP = returnPRP(totalHeart);
  var lungPRP = returnPRP(totalLung);

  var ticks = ['PRP'];
  plot2 = $.jqplot('chart2', [[heartPRP], [lungPRP]], {
      seriesDefaults: {
          renderer:$.jqplot.BarRenderer,
          pointLabels: { show: true }
      },
      axes: {
          xaxis: {
              renderer: $.jqplot.CategoryAxisRenderer,
              ticks: ticks
          },
          yaxis:{
            label:'Percent (%)',
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
          }
      }
  });
<<<<<<< HEAD

  // adjust the graph according to the end of the drag
$('#chart1').bind('jqplotDragStop',
function (seriesIndex, pointIndex, pixelposition, data) {
  // convert to cumulative
  var totalHeart;
  var totalLung;

  // if you moved up go to the top plan
  if(pointIndex.y > yClick)
  {
      totalHeart = convert(heart[0]);
      totalLung = convert(lung[0]);
  }
  // if you moved down go to the bottom plan
  else
  {
      totalHeart = convert(heart[1]);
      totalLung = convert(lung[1]);
  }

  // argument to be passed to plot the data
  var arg = [totalHeart, totalLung];
  //var arg = totalHeart;

  // generate an array to pass in series options for all data sets
  var series = [];
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
      }
    });
  }

  // plot the data
  plot(arg, series);
  plot1.replot();
  plot2.replot();    

  var heartPRP = returnPRP(totalHeart);
  var lungPRP = returnPRP(totalLung);

  var ticks = ['PRP'];
  plot2 = $.jqplot('chart2', [[heartPRP], [lungPRP]], {
      seriesDefaults: {
          renderer:$.jqplot.BarRenderer,
          pointLabels: { show: true }
      },
      axes: {
          xaxis: {
              renderer: $.jqplot.CategoryAxisRenderer,
              ticks: ticks
          },
          yaxis:{
            label:'Percent (%)',
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
          }
      }
  });
}); 

  // replot the data so graphs don't stack
  plot1.replot();
  plot2.replot();
  //$.jqplot.postDrawSeriesHooks.push(updatedSeries);
=======
  plot1.replot();
  plot2.replot();
>>>>>>> b9c80c918e280b587e61b418be9e6dfd35d57168
}

//---------------------------------------------------------------------------------------------------------------
// Highlight and Click Methods

// display data highlight
$('#chart2').bind('jqplotDataHighlight', 
    function (ev, seriesIndex, pointIndex, data) {
        $('#info2').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
    }
);
     
// display data unhighlight
$('#chart2').bind('jqplotDataUnhighlight', 
    function (ev) {
        $('#info2').html('Nothing');
    }
);

// set the start of the drag
$('#chart1').bind('jqplotDragStart', 
function (seriesIndex, pointIndex, pixelposition, data) {
    xClick = data.x;
    yClick = data.y;
});

// possible way to move whole line
function updatedSeries(sctx, options) {
  console.log(JSON.stringify(sctx));
  for(var i=0; i<plot1.series[0].data.length; i++)
  {
      plot1.series[0].data[i][1] += 0.01;
  }
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
$(document).ready(function (){
  loadGraph(2);
  $('#chart2').bind('jqplotDataHighlight', 
      function (ev, seriesIndex, pointIndex, data) {
          $('#info2').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
      }
  );
       
  $('#chart2').bind('jqplotDataUnhighlight', 
      function (ev) {
          $('#info2').html('Nothing');
      }
  );

  $('#chart1').bind('jqplotDragStart', 
  function (seriesIndex, pointIndex, pixelposition, data) {
      console.log(data);
      xClick = data.x;
      yClick = data.y;
  });

  $('#chart1').bind('jqplotDragStop',
  function (seriesIndex, pointIndex, pixelposition, data) {
    //console.log(seriesIndex);
    console.log(pointIndex);
    //console.log(pixelposition); // this is an object with the new coordinates
    //console.log(data);

    // convert to cumulative
    var totalHeart;
    var totalLung;

    // if you moved up go to the top plan
    if(pointIndex.y > yClick)
    {
        totalHeart = convert(heart[0]);
        totalLung = convert(lung[0]);
    }
    // if you moved down go to the bottom plan
    else
    {
        totalHeart = convert(heart[1]);
        totalLung = convert(lung[1]);
    }

    // argument to be passed to plot the data
    var arg = [totalHeart, totalLung];
    //var arg = totalHeart;

    // generate an array to pass in series options for all data sets
    var series = [];
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
        }
      });
    }

    // plot the data
    plot(arg, series);

    var heartPRP = returnPRP(totalHeart);
    var lungPRP = returnPRP(totalLung);

    var ticks = ['PRP'];
    plot2 = $.jqplot('chart2', [[heartPRP], [lungPRP]], {
        seriesDefaults: {
            renderer:$.jqplot.BarRenderer,
            pointLabels: { show: true }
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks
            },
            yaxis:{
              label:'Percent (%)',
              labelRenderer: $.jqplot.CanvasAxisLabelRenderer
            }
        }
    });

    // replot the data
    // so the graphs don't stack
    

  }); 
  plot1.replot();
  plot2.replot();
  //$.jqplot.postDrawSeriesHooks.push(updatedSeries);
  var nav = function () {
    $('.gw-nav > li > a').click(function () {
        var gw_nav = $('.gw-nav');
        gw_nav.find('li').removeClass('active');

        var checkElement = $(this).parent();
        var id = checkElement.attr('id');
        if(id == 1){
          loadGraph(0);
        }
        else if (id == 2){
          loadGraph(1);
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