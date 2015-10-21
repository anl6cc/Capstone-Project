import matplotlib.pyplot as plt;

# read in file
with open('../Patient_12508.Plan_14.dvh.1abCompositeDoseDelivered.esophagus.ddvh', 'r') as f:
	r = f.read();
	# print(r);
	lines = r.splitlines();

	# loop through each line
	n = -1;
	data = dict();
	x = [];
	y = [];
	for i in range(len(lines)):
		if(i == 0):
			n = int(lines[i]);
		else:
			line = lines[i];
			parts = line.split(' ');
			# print(parts);
			data[float(parts[0])] = float(parts[1]);
			x.append(float(parts[0]));
			y.append(float(parts[1]));
	values = list(data.values());
	keys = list(data.keys());
	keys.sort();
	print(x);
	print(y);
	plt.plot(x, y);
	plt.show();


