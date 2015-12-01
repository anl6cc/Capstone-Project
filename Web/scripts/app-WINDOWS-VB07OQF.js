// JSON and node work on Aluu's computer
//console.log(JSON.stringify(vis));
/*
var blah = [1, 2, 3];
console.log(blah.slice(0,2).reduce(function(a, b) { return a + b; }, 0));
*/
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
    console.log(pos[1]);
    s1.push([parseFloat(pos[0]), parseFloat(pos[1])]);
  }

  // return the dose array and the volume array
  return s1;
}

// after reading all files generate the plot given the data points and options to move only in the y direction
function plot(all, seriesOptions)
{
    $.jqplot.config.enablePlugins = true;

    // generate the jqplot
    var plot1 = $.jqplot('chart1',all,{
     title: 'Patient Esophagus and Heart Data (Patient 12508 Trial 14)',
     axes: {
      /*
         xaxis: {
             //renderer: $.jqplot.DateAxisRenderer,
             
             tickOptions: {
                 formatString: '%.2f'
             },
             numberTicks: 4
         },*/
         yaxis: {
          
             tickOptions: {
                 formatString: '%.2f'
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
     series: seriesOptions // need a series to constrain to y for every line
  });
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
  // read in the patient files
  var esophagus = readTextFile("./patient_data/Patient_12508.Plan_14.dvh.1abCompositeDoseDelivered.esophagus.ddvh");
  var heart = readTextFile("./patient_data/Patient_12508.Plan_14.dvh.1abCompositeDoseDelivered.heart.ddvh");

  // convert to cumulative
  var totalEsophagus = convert(esophagus);
  var totalHeart = convert(heart);

  // argument to be passed to plot the data
  var arg = [totalEsophagus, totalHeart];

  // generate an array to pass in series options for all data sets
  var series = [];
  for(var i=0; i<arg.length; i++)
  {
    series.push({
      dragable: {
          color: '#ff3366',
          constrainTo: 'y'
      },
      trendline: {
          color: '#cccccc'
      }
    });
  }

  // plot the data
  plot(arg, series);
});