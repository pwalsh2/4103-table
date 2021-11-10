import React from "react";
import styled from "styled-components";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useAsyncDebounce
} from "react-table";
// A great library for fuzzy filtering/sorting items
import {matchSorter} from "match-sorter";
import "./App.css";
import {makeData,makeTranscript} from "./makeData";
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css";
// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  const count = preFilteredRows.length;

  return (
    <input  
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search Records...`}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id }
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id }
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: "flex"
      }}
    >
      <input
        value={filterValue[0] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            val ? parseInt(val, 10) : undefined,
            old[1]
          ]);
        }}
        placeholder={`Min (${min})`}
        style={{
          width: "70px",
          marginRight: "0.5rem"
        }}
      />
      to
      <input
        value={filterValue[1] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            old[0],
            val ? parseInt(val, 10) : undefined
          ]);
        }}
        placeholder={`Max (${max})`}
        style={{
          width: "70px",
          marginLeft: "0.5rem"
        }}
      />
    </div>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Our table component
     
function Table({
	columns,
	data,
	modalClose,
	modalOpen,
	modalState,
	selectKey,
	selectName,
}) {
	function enterAdvanced(row) {
		const key = row.cells.map((cell) => {
			if (cell.column.id === "student_number") {
				return cell.value;
			}
		});
		const name = row.cells.map((cell) => {
			if (cell.column.id === "name") {
				return cell.value;
			}
		});
		modalOpen();
		selectName(name);
		selectKey(key);
		console.log(key);
	}
	const filterTypes = React.useMemo(
		() => ({
			// Add a new fuzzyTextFilterFn filter type.
			fuzzyText: fuzzyTextFilterFn,
			// Or, override the default text filter to use
			// "startWith"
			text: (rows, id, filterValue) => {
				return rows.filter((row) => {
					const rowValue = row.values[id];
					return rowValue !== undefined
						? String(rowValue)
								.toLowerCase()
								.startsWith(String(filterValue).toLowerCase())
						: true;
				});
			},
		}),
		[]
	);

	const defaultColumn = React.useMemo(
		() => ({
			// Let's set up our default Filter UI
			Filter: DefaultColumnFilter,
		}),
		[]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		state,
		visibleColumns,
	} = useTable(
		{
			columns,
			data,
			defaultColumn, // Be sure to pass the defaultColumn option
			filterTypes,
		},
		useFilters, // useFilters!
		useGlobalFilter,
		useSortBy // useGlobalFilter!
	);

	// We don't want to render all of the rows for this example, so cap
	// it for this use case
	const firstPageRows = rows;

	return (
		<>
			<table className='styled-table' {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th {...column.getHeaderProps(column.getSortByToggleProps())}>
									{column.render("Header")}
									{/* Render the columns filter UI */}
									<div>
										{column.canFilter ? column.render("Filter") : null}
										<span>
											{column.isSorted
												? column.isSortedDesc
													? "🔽"
													: "🔼"
												: ""}{" "}
										</span>
									</div>
								</th>
							))}
						</tr>
					))}
					<tr>
						<th colSpan={visibleColumns.length}></th>
					</tr>
				</thead>
				<tbody {...getTableBodyProps()}>
					{firstPageRows.map((row, i) => {
						prepareRow(row);
						return (
							<tr onClick={() => enterAdvanced(row)} {...row.getRowProps()}>
								{row.cells.map((cell) => {
									return (
										<td className='table-td-cell' {...cell.getCellProps()}>
											{cell.render("Cell")}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			<br />

			<div>
				<pre>
					<code>{JSON.stringify(state.filters, null, 2)}</code>
				</pre>
			</div>
		</>
	);
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
	return rows.filter((row) => {
		const rowValue = row.values[id];
		return rowValue >= filterValue;
	});
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== "number";

function App() {
	const [data, setData] = React.useState([]);
	const [TranscriptData, setTranscriptData] = React.useState([]);
	const [modalShow, setModalShow] = React.useState(false);
	const [advancedKey, advancedKeySet] = React.useState([]);
	const [transcriptName, setTranscriptName] = React.useState("");
	const handleClose = () => setModalShow(false);
	const handleShow = () => setModalShow(true);
	React.useEffect(() => {
		(async () => {
			await makeData(setData);
		})();
	}, []);

	React.useEffect(() => {
		(async () => {
			await makeTranscript(advancedKey, setTranscriptData);
		})();
	}, [advancedKey]);

	const columns = React.useMemo(
		() => [
			{
				Header: " ",
				columns: [
					{
						Header: "Student ID",
						accessor: "student_number",
					},
					{
						Header: "Name",
						accessor: "name",
					},
					{
						Header: "Program",
						accessor: "program",
					},
					{
						Header: "Campus",
						accessor: "campus",
						Filter: SelectColumnFilter,
						filter: "includes",
					},
					{
						Header: "Rank",
						accessor: "rank",
						Filter: SelectColumnFilter,
					},
				],
			},
		],
		[]
	);

	const columnsTranscripts = React.useMemo(
		() => [
			{
				Header: " ",
				columns: [
					{
						Header: "Course Code",
						accessor: "Course_Code",
					},
					{
						Header: "Course Name",
						accessor: "Course_Name",
					},
					{
						Header: "Semester",
						accessor: "Semester",
					},
					{
						Header: "Section",
						accessor: "Section",
						Filter: SelectColumnFilter,
						filter: "includes",
					},
					{
						Header: "Credit Hours",
						accessor: "Credit_Hours",
						Filter: SelectColumnFilter,
					},
				],
			},
		],
		[]
	);

	return (
		<>
			<Modal
				show={modalShow}
				onHide={handleClose}
				aria-labelledby='example-modal-sizes-title-lg'
				size='xl'>
				<Modal.Header closeButton>
					<Modal.Title>Transcript</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className='row_modal'>
						<div className='column_modal'>
							<Table columns={columnsTranscripts} data={TranscriptData}></Table>
						</div>
						<div className='column_modal'>
							<h1>{transcriptName}</h1><br/>
							<h2>{advancedKey}</h2>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
			<Table
				columns={columns}
				data={data}
				modalClose={handleClose}
				modalOpen={handleShow}
				modalState={modalShow}
				selectKey={advancedKeySet}
				selectName={setTranscriptName}
			/>
		</>
	);
}

export default App;
