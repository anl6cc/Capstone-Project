# read in file
with open('test.ddvh', 'r') as f:
    r = f.read();
    print(r);
    lines = r.splitlines();

    # loop through each line
    n = -1;
    data = dict();
    for i in range(len(lines)):
    	if(i == 0):
    		n = int(lines[i]);
    	else:
    		line = lines[i];
    		parts = line.split(' ');
    		print(parts);
    		data[parts[0]] = parts[1];
    print(data);


