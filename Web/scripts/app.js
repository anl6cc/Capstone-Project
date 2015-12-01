// JSON and node work on Aluu's computer
//console.log(JSON.stringify(vis));

/*
NOTES from meeting here bc idk
convert ddvh to cumulative with thing like his python function
grab curve
id what curve it is
write up summary/bullet list of technology we're using and why we're using it
For specific patient:
  there's multiple plans
  want all ddvh data from all the plans for each organ (Ex: heart)
  when you drag you are shifting from one plan to another
  compute min and max to where they can drag it to
  shift all other organ graphs from to the appropriate plan that is dragged to
  each graph wouldn't necessarily have the same min and max
  pick an organ
    display a min of the desired organ
    say lung to start with
    show corresponding other organs
each plan has all organs from all other plans included
when they select any point that is dragged to new plan then shift the entire line (and other lines)

Grant: Aim 3 is where we try to develop
12508 patient not de best one
he has a rly nice one that he will send us soon
just lung and heart for now

Value Hierarchy
Patient
  Plan
    PTV
    Lung
    Heart
    Esop

User should be able to reorder these and that will determine what they will see (top will be minimalized)

NTCP analysis

Dun need patient on the navigation bar

Just have patient selection on a separate page
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

  // return the array
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
         tooltipFormatString: '<b><i><span style="color:red;">Dose</span></i></b> %.2f',
         useAxesFormatters: false
     },
     cursor: {
         show: true
     },
     series: seriesOptions // need a series to constrain to y for every line
  });
}

// called at the beginning
$(document).ready(function () {
  // read in the patient files
  var esophagus = readTextFile("./patient_data/Patient_12508.Plan_14.dvh.1abCompositeDoseDelivered.esophagus.ddvh");
  var heart = readTextFile("./patient_data/Patient_12508.Plan_14.dvh.1abCompositeDoseDelivered.heart.ddvh");

  // argument to be passed to plot the data
  var arg = [esophagus, heart];

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