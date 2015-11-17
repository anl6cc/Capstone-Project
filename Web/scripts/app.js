  // JSON and node work on Aluu's computer
  //console.log(JSON.stringify(vis));

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
                //document.getElementById("textfile").innerHTML = rawFile.responseText;
                //console.log(rawFile.responseText);
                var dataString = rawFile.responseText;
                initialize(dataString);
            }
        }
    }
    rawFile.send(null);
  }

  readTextFile("./patient_data/Patient_12508.Plan_14.dvh.1abCompositeDoseDelivered.esophagus.ddvh");
  //readTextFile("./patient_data/test.txt");

  // initialize the graph
  function initialize(dataString)
  {
      // create an array with nodes
  /*
  var nodes = new vis.DataSet([
    {id: 1, color: 'lime', x: 0, y: 0, allowedToMoveX: true},
    {id: 2, label: 'Node 2', x: 100.5, y: 100},
    {id: 3, label: 'Node 3', x: 200, y: 200},
    {id: 4, label: 'Node 4', x: 300, y: 300},
    {id: 5, label: 'Node 5', x: 400, y: 400}
  ]);
  */

  var nodeArray = [];
  var edgeArray = [];

  var lines = dataString.split("\n");
  var num = parseInt(lines[0], 10);

  //console.log(JSON.stringify(lines));
  
  for(var i=1; i < num + 1; i++)
  {
    var pos = lines[i].split(" ");
    nodeArray.push({id: i, x: parseFloat(pos[0]), y: parseFloat(pos[1]) * 10000});
    if(i !== 1)
    {
      edgeArray.push({from: i - 1, to: i, length: 10});
    }
  }

  console.log(JSON.stringify(nodeArray));
  
  var nodes = new vis.DataSet(nodeArray);
  
  // create an array with edges
  /*
  var edges = new vis.DataSet([
    {from: 1, to: 2, length: 10},
    {from: 2, to: 3, length: 10},
    {from: 3, to: 4, length: 10},
    {from: 4, to: 5, length: 10}
  ]);
  */
  var edges = new vis.DataSet(edgeArray);

  // create a network
  var container = document.getElementById('mynetwork');
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {
    nodes: {
        fixed: {
            x: true,
            y: true
        }
    },
    edges: {
        smooth: {
            enabled: false
        }, 
        width: 5
    },
    height: '100%'
  };
  var network = new vis.Network(container, data, options);
  }