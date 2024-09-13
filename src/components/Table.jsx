import React, { useMemo, memo } from 'react';
import { MaterialReactTable, useMaterialReactTable, MRT_ToggleFiltersButton } from 'material-react-table';
import { cn } from '@/lib/utils';

const Table = ({ data, maxSigma }) => {

  const columns = useMemo(() => {
    if (!data || !data.length) 
      return [];
    return (
      Object.keys(data[0]).map(item => {
        let option = {
          accessorKey: item,
          header: item.replaceAll('_', ' ').replace('percent', '%'),
          filterfilterFn: 'contains',
          filterVariant: 'text',
          minSize: 50, 
          size: 100,
          Cell: ({ cell }) => (
            <div className='p-1'>
              {cell.getValue().toFixed(2)}
            </div>
          ),
        };
        if (item === "percent_in_out_money") {
          option.header = "% in/out money";
          option.filterVariant = 'multi-select';
          option.filterSelectOptions = ['in', 'out'];
          option.Cell = ({ cell }) => {
            let value = cell.getValue().toFixed(2);
            return (
              <div className={cn("m-0 size-full p-1", value<0 ? 'bg-[#FFFBD6]' : 'bg-[#FFE0B1]')} >
                { value }
              </div>
            );
          };
          option.filterFn = (row, columnId, filterValue) => {
            const value = row.getValue(columnId);
            if (filterValue.includes('in') && value >= 0) 
              return true;
            else if (filterValue.includes('out') && value < 0) 
              return true;
            else if (filterValue.length===0) 
              return true;
            else 
              return false;
          };
        } else if (item === "percent_return_1_sigma_max_risk") {
          option.header = "% return / % max risk";
          option.Cell = ({ cell }) => {
            let color, value = (cell.getValue()/maxSigma*100).toFixed(2);
            if (parseInt(value)<10) 
              color = "rgb(255, 160, 160)";
            else if (parseInt(value)<50)
              color = "rgb(255, 227, 122)";
            else 
              color = "rgb(166, 245, 188)";
            return (
              <div style={{backgroundColor: "transparent", background: `linear-gradient(to right, ${color} ${value}%, transparent ${value}%)`}} className='p-1'>
                { cell.getValue().toFixed(2) }
              </div>
            );
          }
        }
        return option;
      })
    );
  }, [data]);
  

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: { 
      showColumnFilters: true,
    },
    enablePagination: false,
    enableKeyboardShortcuts: false,
    enableDensityToggle: false,
    enableHiding: false,
    enableFullScreenToggle: false,

    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)', 
        display: 'flex',
        flexDirection: 'column',
      },
    },
    muiTableProps: {
      sx: {
        tableLayout: 'auto', 
      },
    },
    muiTableHeadProps: {
      sx: {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: "#0F172A",
        flex: "0 0 auto",
      },
    },
    muiTableBodyProps: {
      sx: {
        overflowY: 'auto', 
        flexGrow: 1,
        '& tr:nth-of-type(even) > td': {
          backgroundColor: '#EFEFEF',
        },
        "& th": {
          width: "100px",
        },
        "& td": {
          width: "100px",
        },
      },
    },

    muiTableHeadCellProps: {
      sx: {
        borderRight: '0.5px solid white',
        fontWeight: '700',
        backgroundColor: "#0F172A",  
        color: "white",              
        textTransform: "capitalize",
        textWrap: "wrap",
        opacity: "1",
        "& .MuiBox-root": {
          color: "white",           
        },
        "& .MuiSelect-select .MuiBox-root": {
          color: "grey",           
        },
        "& svg": {
          color: "white !important",           
          opacity: "1 !important", 
          transition: "none !important",         
        },
        "& span": {
          color: "white !important",           
        },
        "& .MuiButtonBase-root path": {
          color: "white",           
        },
        "& input": {
          color: "white",           
        },
        "& .MuiInputBase-colorPrimary": {
          color: "white",           
        },
        "& .MuiInputBase-root": {
          borderColor: "white",
        },
        "& .Mui-TableHeadCell-Content.MuiBox-root.css-1w86f15": {
          padding: "10px 0",
          height: "110px",
        },
        "& .css-15cv2x7-MuiInputBase-root-MuiInput-root": {
          maxWidth: "150px",
        },
        "& .css-hw2a1y-MuiTableCell-root": {
          padding: "0",
        },
        "& .Mui-TableHeadCell-Content": {
          justifyContent: "center !important",
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
        padding: "0",
        textAlign: "right",
        fontSize: "13px",
        fontWeight: "bold",
        color: "#000000DE",
        width: "10px",
        "& .Mui-TableHeadCell-Content": {
          alignItems: "center",
        }
      },
    },

    renderTopToolbar: ({ table }) => (
      <div className=' my-3 flex justify-between'>
        <div className='font-bold text-xl text-black'> 
          Apple Inc. (AAPL)&ensp; $214.29 &nbsp;
          <span className='text-red-800'>($&ensp; -2.38)&ensp; -1.1%</span>
        </div>
        <MRT_ToggleFiltersButton table={table} />
      </div>
    )
  });


  return (
    <MaterialReactTable table={table} />
  )
}

export default Table;
