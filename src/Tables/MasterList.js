// Our table component
import {
	fuzzyTextFilterFn,
	DefaultColumnFilter,
} from "../ColumnsFilters/Filters";
import {
	useTable,
	useFilters,
	useGlobalFilter,
	useSortBy,
	useAsyncDebounce,
} from "react-table";
import React from "react";

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

export function TableMasterList({
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
							<tr
								className='List_Row'
								onClick={() => enterAdvanced(row)}
								{...row.getRowProps()}>
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
		</>
	);
}
