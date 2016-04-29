// read in patient files
var readFiles = function(patient, number)
{
	var lines = [];

	for(var i=0; i<number; i++)
	 {
	    lines[i] = [];
	 }
	// patient 0: dvh12960
	// patient 1: dvh12967
	// patient 2: Patient12550Dvh
	// patient 3: Patient12578_Dvh
	var path = "";
	if(patient)
		path = "./patient_data/qcMCO/Patient_3/";
	else
		path = "./patient_data/qcMCO/Patient_0/";

	lines[0].push(readTextFile(path + "CRT_3D.Heart.ddvh"));
	lines[1].push(readTextFile(path + "CRT_3D.Lt_Lung.ddvh"));
	lines[2].push(readTextFile(path + "CRT_3D.Rt_Lung.ddvh"));
	lines[3].push(readTextFile(path + "CRT_3D.Esophagus.ddvh"));
	lines[4].push(readTextFile(path + "CRT_3D.PTV.ddvh"));

	lines[0].push(readTextFile(path + "CRT_con.Heart.ddvh"));
	lines[1].push(readTextFile(path + "CRT_con.Lt_Lung.ddvh"));
	lines[2].push(readTextFile(path + "CRT_con.Rt_Lung.ddvh"));
	lines[3].push(readTextFile(path + "CRT_con.Esophagus.ddvh"));
	lines[4].push(readTextFile(path + "CRT_con.PTV.ddvh"));

	lines[0].push(readTextFile(path + "CRT_Esop.Heart.ddvh"));
	lines[1].push(readTextFile(path + "CRT_Esop.Lt_Lung.ddvh"));
	lines[2].push(readTextFile(path + "CRT_Esop.Rt_Lung.ddvh"));
	lines[3].push(readTextFile(path + "CRT_Esop.Esophagus.ddvh"));
	lines[4].push(readTextFile(path + "CRT_Esop.PTV.ddvh"));

	lines[0].push(readTextFile(path + "CRT_Heart.Heart.ddvh"));
	lines[1].push(readTextFile(path + "CRT_Heart.Lt_Lung.ddvh"));
	lines[2].push(readTextFile(path + "CRT_Heart.Rt_Lung.ddvh"));
	lines[3].push(readTextFile(path + "CRT_Heart.Esophagus.ddvh"));
	lines[4].push(readTextFile(path + "CRT_Heart.PTV.ddvh"));

	lines[0].push(readTextFile(path + "CRT_ips.Heart.ddvh"));
	lines[1].push(readTextFile(path + "CRT_ips.Lt_Lung.ddvh"));
	lines[2].push(readTextFile(path + "CRT_ips.Rt_Lung.ddvh"));
	lines[3].push(readTextFile(path + "CRT_ips.Esophagus.ddvh"));
	lines[4].push(readTextFile(path + "CRT_ips.PTV.ddvh"));

	 // read in old patient files
	 /*
	 lines[0].push(readTextFile("./patient_data/LungDVHAD/heart/4-beam_Esop.heart.ddvh"));
     lines[1].push(readTextFile("./patient_data/LungDVHAD/left_lung/4-beam_Esop.L_lung.ddvh"));
	 lines[2].push(readTextFile("./patient_data/LungDVHAD/right_lung/4-beam_Esop.R_lung.ddvh"));
	 lines[3].push(readTextFile("./patient_data/LungDVHAD/esophagus/4-beam_Esop.esophagus.ddvh"));
	 lines[4].push(readTextFile("./patient_data/LungDVHAD/PTV/4-beam_Esop.PTV.ddvh"));

	 lines[0].push(readTextFile("./patient_data/LungDVHAD/heart/9-beam_Esop.heart.ddvh"));
	 lines[1].push(readTextFile("./patient_data/LungDVHAD/left_lung/9-beam_Esop.L_lung.ddvh"));
	 lines[2].push(readTextFile("./patient_data/LungDVHAD/right_lung/9-beam_Esop.R_lung.ddvh"));
	 lines[3].push(readTextFile("./patient_data/LungDVHAD/esophagus/9-beam_Esop.esophagus.ddvh"));
	 lines[4].push(readTextFile("./patient_data/LungDVHAD/PTV/9-beam_Esop.PTV.ddvh"));

	 lines[0].push(readTextFile("./patient_data/LungDVHAD/heart/38-beamNCP_Esop.heart.ddvh"));
	 lines[1].push(readTextFile("./patient_data/LungDVHAD/left_lung/38-beamNCP_Esop.L_lung.ddvh"));
	 lines[2].push(readTextFile("./patient_data/LungDVHAD/right_lung/38-beamNCP_Esop.R_lung.ddvh"));
	 lines[3].push(readTextFile("./patient_data/LungDVHAD/esophagus/38-beamNCP_Esop.esophagus.ddvh"));
	 lines[4].push(readTextFile("./patient_data/LungDVHAD/PTV/38-beamNCP_Esop.PTV.ddvh"));
	 */

	 return lines;
}