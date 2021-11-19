import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { TableTranscript } from "../Tables/Transcript";
import { columnsTranscripts } from "../ColumnsFilters/Columns";

export function TranscriptModal(
	modalShowIN,
	handleCloseIN,
	TranscriptDataIN,
	transcriptNameIN,
	advancedKeyIN
) {
	return (
		<Modal
			show={modalShowIN}
			onHide={handleCloseIN}
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
							data={TranscriptDataIN}></TableTranscript>
					</div>
					<div className='column_modal'>
						<h1 style={{ fontFamily: "sans-serif" }}>{transcriptNameIN}</h1>
						<br />
						<h2 style={{ fontFamily: "sans-serif" }}>{advancedKeyIN}</h2>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={handleCloseIN}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
