//read in the text file
function readTextFile(file)
{
    data = [];
    $.ajaxSetup({async: false});
    $.get(file, function(level) {
        var lines = level.split("\n");
        var length = lines[0].trim();
        for (var i=1; i<length; i++) {
          var line = lines[i];
          if (!line.trim()) continue;
          line = line.split(" ");
          if(line[0] == null) continue;
          if(line[1] == null) continue;
          data.push([parseFloat(line[0].trim()), parseFloat(line[1].trim())]);
        }
    });
    return data;
}

// convert the data from dvh volume to cdvh volume
// uses method from Watkin's python program
function convert(data)
{
  var dose = [];
  var volume = [];
  var total_volume = 0;
  alert("THIS IS THE DATA: " + data.toString());
  for(var i=0; i<data.length; i++)
  {
    dose.push(data[i][0]);
    volume.push(data[i][1]);
    total_volume += parseFloat(data[i][1]);
  }
  alert("TOTAL VOLUME: " + total_volume);
  totalData = [];
  for(var i=data.length-1; i>-1; i--)
  {
    var sum = volume.slice(0,i).reduce(function(a, b) { return parseFloat(a + b); }, 0);
    totalData[i] = [dose[i], 1 - sum/total_volume];
  }

  return totalData;
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


//import data into graph
$(document).ready(function () {
    var heart = readTextFile("./patient_data/LungDVHAD/heart/4-beam_Esop.heart.ddvh");
    var lung = readTextFile("./patient_data/LungDVHAD/lung/4-beam_Esop.L_lung.ddvh");

    var totalHeart = convert(heart);
    var totalLung = convert(lung);

    alert("TOTAL HEART: " + totalHeart);
   
    $(function () {
        $('#container').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: 'Heart vs. Lung'
            },
            subtitle: {
                text: 'subtitle goes here'
            },
            xAxis: {
                title: {
                    text: 'Time'
                },
                min: 0
            },
            yAxis: {
                title: {
                    text: 'Dosage (m)'
                },
                min: 0,
                max: 1
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:2f}: {point.y:.2f} m'
            },

            plotOptions: {
                line: {
                    marker: {
                        enabled: true,
                        radius: 2
                    }
                }
                series: {
                    point: {
                        events: {

                            drag: function (e) {
                                // Returning false stops the drag and drops. Example:
                                /*
                                if (e.newY > 300) {
                                    this.y = 300;
                                    return false;
                                }
                                */
                            }
                        }
                    }
                }
            },

            series: [{
                name: 'Heart',
                draggableY: true,
                data: totalHeart
            }, {
                name: 'Lung',
                draggableY: true,
                data: totalLung
            }]
        });
    });