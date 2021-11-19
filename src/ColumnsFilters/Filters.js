import React from "react";
import { matchSorter } from "match-sorter";
export function compareCourseCode(rowA, rowB, id, desc) {
	let arr_A = rowA.values[id];
	arr_A = arr_A.split("*");
	console.log(arr_A);
	let arr_B = rowB.values[id];

	arr_B = arr_B.split("*");
	console.log(arr_B);
	let a = Number.parseFloat(arr_A[1]);
	let b = Number.parseFloat(arr_B[1]);
	if (Number.isNaN(a)) {
		// Blanks and non-numeric strings to bottom
		a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
	}
	if (Number.isNaN(b)) {
		b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
	}
	if (a > b) return 1;
	if (a < b) return -1;
	return 0;
}

// Define a filter for greater than
export function filterGreaterThan(rows, id, filterValue) {
	return rows.filter((row) => {
		const rowValue = row.values[id];
		return rowValue >= filterValue;
	});
}

// Define a default UI for filtering
export function DefaultColumnFilter({
	column: { filterValue, preFilteredRows, setFilter },
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

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
export function NumberRangeColumnFilter({
	column: { filterValue = [], preFilteredRows, setFilter, id },
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
				display: "flex",
			}}>
			<input
				value={filterValue[0] || ""}
				type='number'
				onChange={(e) => {
					const val = e.target.value;
					setFilter((old = []) => [
						val ? parseInt(val, 10) : undefined,
						old[1],
					]);
				}}
				placeholder={`Min (${min})`}
				style={{
					width: "70px",
					marginRight: "0.5rem",
				}}
			/>
			to
			<input
				value={filterValue[1] || ""}
				type='number'
				onChange={(e) => {
					const val = e.target.value;
					setFilter((old = []) => [
						old[0],
						val ? parseInt(val, 10) : undefined,
					]);
				}}
				placeholder={`Max (${max})`}
				style={{
					width: "70px",
					marginLeft: "0.5rem",
				}}
			/>
		</div>
	);
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
	column: { filterValue, setFilter, preFilteredRows, id },
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
			}}>
			<option value=''>All</option>
			{options.map((option, i) => (
				<option key={i} value={option}>
					{option}
				</option>
			))}
		</select>
	);
}

export function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}
