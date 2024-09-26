import React, { useEffect, useState } from 'react';
import useApi from './utils/api';
import RangeSlider from './components/RangeSlider';
import { useToast } from "./hooks/use-toast";
import { ToastAction } from "@/components/ui/toast"
import Table from './components/Table';

const App = () => {

  const { toast } = useToast();

  const [actualData, setActualData] = useState(null);
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState(10);
  const [maxSigma, setMaxSigma] = useState(0);
  const strikeTarget = 214.29;
  
  //* fetching api
  useEffect(() => {
    (async () => {
      try {
        let response = await useApi("get", "/table_data");
        let data = await response.data;
        setActualData(data);
        setMaxSigma(data.reduce((acc, e) => (acc<e["percent_return_1_sigma_max_risk"] ? e["percent_return_1_sigma_max_risk"] : acc), 0));
        toast({
          variant: "success",
          title: "Data fetched successfully",
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch data",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    })()
  }, []);

  useEffect(() => {
    if (actualData) {
      let maxTargetStrike = actualData.filter(e => e.strike>strikeTarget).sort((a,b) => a.strike-b.strike);
      let minTargetStrike = actualData.filter(e => e.strike<=strikeTarget).sort((a,b) => b.strike-a.strike);
      let updatedData=[], halfDataCount = dataCount/2;

      if (halfDataCount>maxTargetStrike.length) {
        updatedData = [...minTargetStrike.slice(0, dataCount-maxTargetStrike.length).toReversed(), ...maxTargetStrike];
      } else if (halfDataCount>minTargetStrike.length) {
        updatedData = [...minTargetStrike.toReversed(), ...maxTargetStrike.slice(0, dataCount-minTargetStrike.length)];
      } else {
        updatedData = [...minTargetStrike.slice(0,halfDataCount).toReversed(), ...maxTargetStrike.slice(0,halfDataCount), ];
      }

      let newData = [], requiredData = JSON.parse(JSON.stringify(updatedData));
      for (let i=0; i<requiredData.length; i+=2) {
        requiredData[i].subRows = [requiredData[i+1]];
        newData.push(requiredData[i]);
      }
      setData(newData);

      // setData(actualData.slice(0,dataCount));
      
    }
  }, [dataCount, actualData]);

  if (!actualData) 
    return <div className='text-center text-lg text-red-500 mt-10'>Loading...</div>
  else if (actualData.length===0) 
    return <div className='text-center text-lg mt-10 text-blue-500'>No data found</div>
  return (
    <div className="p-4">
      {/* Slider */}
      <RangeSlider max={actualData.length} dataCount={dataCount} setDataCount={setDataCount} />
      
      {/* Table */}
      <Table data={data} maxSigma={maxSigma} />
    </div>
  )
}

export default App
