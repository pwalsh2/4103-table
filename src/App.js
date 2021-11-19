import React from "react";
import styled from "styled-components";

import Counts from "./counts";
// A great library for fuzzy filtering/sorting items

import "./App.css";
import { makeData, makeTranscript } from "./makeData";

import "bootstrap/dist/css/bootstrap.min.css";
import { TableMasterList } from "./Tables/MasterList";

import { columns } from "./ColumnsFilters/Columns";
import { transcriptModal } from "./Modal/TranscriptModal";

import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { TableTranscript } from "./Tables/Transcript";
import { columnsTranscripts } from "./ColumnsFilters/Columns";

function App() {
	const [data, setData] = React.useState([]);
	const [TranscriptData, setTranscriptData] = React.useState([]);

	const [advancedKey, advancedKeySet] = React.useState([]);
	const [transcriptName, setTranscriptName] = React.useState("");

	const [modalShow, setModalShow] = React.useState(false);
	const handleClose = () => setModalShow(false);
	const handleShow = () => setModalShow(true);
	console.log(modalShow);
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

	return (
		<>
			<div className='master-container'>
				<div className='div-table'>
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
									<TableTranscript
										columns={columnsTranscripts}
										data={TranscriptData}></TableTranscript>
								</div>
								<div className='column_modal'>
									<h1 style={{ fontFamily: "sans-serif" }}>{transcriptName}</h1>
									<br />
									<h2 style={{ fontFamily: "sans-serif" }}>{advancedKey}</h2>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={handleClose}>
								Close
							</Button>
						</Modal.Footer>
					</Modal>
					<TableMasterList
						columns={columns}
						data={data}
						modalClose={handleClose}
						modalOpen={handleShow}
						modalState={modalShow}
						selectKey={advancedKeySet}
						selectName={setTranscriptName}
					/>
				</div>
				<div className='div-counts'>
					<Counts></Counts>
				</div>
			</div>
		</>
	);
}

export default App;
