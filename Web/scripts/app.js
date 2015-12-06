// JSON and node work on Aluu's computer
//console.log(JSON.stringify(vis));

/*
var blah = [1, 2, 3];
console.log(blah.slice(0,2).reduce(function(a, b) { return a + b; }, 0));
*/
var plot1;
var xClick;
var yClick;

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
    // console.log(pos[1]);
    s1.push([parseFloat(pos[0]), parseFloat(pos[1])]);
  }

  // return the dose array and the volume array
  return s1;
}

// after reading all files generate the plot given the data points and options to move only in the y direction
function plot(all, seriesOptions)
{
    $.jqplot.config.enablePlugins = true;

    //console.log(JSON.stringify(all));
    
    // generate the jqplot
    plot1 = $.jqplot('chart1', all,{
     title: 'Heart (blue) vs Lung (orange)',
     // axesDefaults: {
     //    tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
     //    tickOptions: {
     //      angle: 30
     //    }
     //  },
     //  axes:{
     //    xaxis:{
     //      label:'Bottom',
     //      labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
     //      labelOptions: {
     //        fontFamily: 'Helvetica',
     //        fontSize: '14pt'
     //      },
     //    },
     //    yaxis:{
     //      label:'Top',
     //      labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
     //      labelOptions: {
     //        fontFamily: 'Helvetica',
     //        fontSize: '14pt'
     //      },
     //      tickOptions: {
     //        formatString: '%.2f'
     //      }
     //    }
     //  },
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
        location: 's' ,
        placement : "outside",
        marginTop : "50px",
        rendererOptions: {
            numberRows: 1
        },
        seriesToggle: true
      },
    series: seriesOptions
    /*seriesDefaults:
    {
      dragable: {
          color: '#ff3366',
          constrainTo: 'y'
      },
      markerOptions: {
        show: false,
        size: 2
     }
    }*/
  });
  console.log(JSON.stringify(seriesOptions));
    //console.log(JSON.stringify(plot1.series[0].data));
}

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

// called at the beginning
$(document).ready(function () {
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
  var totalHeart = convert(heart[2]);
  var totalLung = convert(lung[2]);

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
  var s1 = [0.2];
  var s2 = [0.7];
  var ticks = ['PRP'];
  plot2 = $.jqplot('chart2', [s1, s2], {
      seriesDefaults: {
          renderer:$.jqplot.BarRenderer,
          pointLabels: { show: true }
      },
      axes: {
          xaxis: {
              renderer: $.jqplot.CategoryAxisRenderer,
              ticks: ticks
          }
      }
  });

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
  returnPRP(totalHeart[0], totalHeart[1]);

  $('#chart1').bind('jqplotDragStart',
    function (seriesIndex, pointIndex, pixelposition, data) {
      console.log("loooooooooooooool");
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

      //var x = pixelposition.xaxis;

      //console.log(JSON.stringify(totalHeart));
      //console.log(heart[0][x]);
      //console.log(x);

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

      returnPRP(totalHeart[0], totalHeart[1]);

      // replot the data
      // so the graphs don't stack
      plot1.replot();

  }); 

  $.jqplot.postDrawSeriesHooks.push(updatedSeries);
  
    function updatedSeries(sctx, options) {
      console.log(JSON.stringify(sctx));
      for(var i=0; i<plot1.series[0].data.length; i++)
      {
          plot1.series[0].data[i][1] += 0.01;
      }
    }

    function returnPRP(dose, volume)
    {
      var con = -2.98;
      var c_d = 0.0356;
      var c_v = 4.13;
      var c_v2 = -5.18;
      var c_d2 = -0.000727;
      var c_dv = 0.221;
      var PRPSum = 0;
      var PRP = [];
      for(var i=volume.length-1; i>-1; i--)
      {
          var expFactor = con + c_d * dose[i] + c_v * volume[i] + c_d2 * Math.pow(dose[i], 2) + c_v2 * Math.pow(volume[i], 2) + c_dv * dose[i]*volume[i];
          PRP[i] = 1 / (1 + Math.log(-1.0*expFactor));
          PRPSum = PRPSum + PRP[i];
      }

      PRP_Value = PRPSum / (1.15 * volume.length);
      
      $('#number').html("Heart PRP Value: " + PRP_Value);

      console.log(PRP_Value);
    }
});