alert('sup');
/*
function initPPGgraph()
{
    $scope.container = document.getElementById('visualization');
    $scope.dataset = new vis.DataSet();

    var options = {
	height: '200px',
	width: '100%',
	moveable: false,
	// how much further from the beginning the graph starts
	start: vis.moment().add(-10, 'seconds'),
	end: vis.moment(),
	dataAxis: {
	    visible: false
	},
	drawPoints: false,
	shaded: false,
	showMajorLabels: false,
	showMinorLabels: false
    };
    $scope.graph2d = new vis.Graph2d($scope.container, $scope.dataset, options);
}

//add the red num point to the real time ppg plot
function plotRedNums()
{	 
	renderStep();
	addDataPoint();
}

// move the window of the graph
function renderStep() {
    var now = vis.moment();
    var range = $scope.graph2d.getWindow();
    var interval = range.end - range.start;
    //discrete setting
    $scope.graph2d.setWindow(now - interval, now, {animation: false});
}

// add a datapoint to the dataset and remove old datapoints
function addDataPoint() {
    var now = vis.moment();
    $scope.dataset.add({
      x: now,
      y: $scope.redNums[$scope.redNums.length - 1]
    });
    // remove all data points which are no longer visible
    var range = $scope.graph2d.getWindow();
    var interval = range.end - range.start;
    var oldIds = $scope.dataset.getIds({
		filter: function (item) {
			return item.x < range.start - interval;
		}
    });
    $scope.dataset.remove(oldIds);
}*/