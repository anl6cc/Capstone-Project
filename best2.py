import plotly.plotly as py
import plotly.graph_objs as go

py.sign_in('Kyq3ar', 'c55lnazqwi');
# read in file
with open('test.ddvh', 'r') as f:
    r = f.read();
    print(r);
    lines = r.splitlines();

    # loop through each line
    n = -1;
    #data = dict();
    keys = list();
    values = list();
    for i in range(len(lines)):
        if(i == 0):
             n = int(lines[i]);
        else:
            line = lines[i];
            parts = line.split(' ');
            keys.append(parts[0]);
            values.append(parts[1]);
    trace = go.Scatter(
        x = keys,
        y = values
        );
    data = [trace];

    py.plot(data);
