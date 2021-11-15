import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  DropdownButton,
  Dropdown,
  Table,
  Form,
  Button,
  Row,
  Col
} from "react-bootstrap";

import axios from "axios";

import "./styles.css";

export default function Counts() {
  const [value, setValue] = useState({ title: "Cohort", input: "" });
  const [counts, setCounts] = useState({
    coop: 0,
    total: 0,
    FIR: 0,
    SOP: 0,
    JUN: 0,
    SEN: 0
  });

  const submitValue = (e) => {
    // Make API call and update setCounts based on selected parameter

    let url = "";
    if (value.title.toLowerCase() === "cohort") {
      url = "http://127.0.0.1:8000/api/counts_start_date/" + value.input;
    } else {
      url = "http://127.0.0.1:8000/api/counts_semester/" + value.input;
    }

    axios.get(url).then((res) => {
      setCounts({
        coop: res.data.countCoop,
        total: res.data.countTotal,
        FIR: res.data.FIR,
        SOP: res.data.SOP,
        JUN: res.data.JUN,
        SEN: res.data.SEN
      });
    });
  };

  return (
    <div className="countsCard">
      <div className="headerDiv">
        <div className="dropdownDiv">
          <DropdownButton
            id="dropdown-basic-button"
            title={value.title}
            variant="danger"
            onSelect={(e) => setValue({ title: e, input: value.input })}
          >
            <Dropdown.Item eventKey="Cohort">Cohort</Dropdown.Item>
            <Dropdown.Item eventKey="Semester">Semester</Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="formDiv">
          <Form>
            <Row>
              <Col>
                <input 
                 
                  className="inputValueForm"
                  type="text"
                  placeholder={value.title}
                  onChange={(e) =>
                    setValue({ title: value.title, input: e.target.value })
                  }
                />
              </Col>
              <Col>
                <button
                  
                  className="submitValueForm"
                  
                  onClick={submitValue}
                >
                  Submit
                </button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <br />
      <div className="tableDiv">
        <Table hover size="sm">
          <thead>
            <tr>
              <th>Enrolled For: {value.title}</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody className = "counts_tbody">
            <tr>
              <td>Total</td>
              <td>{counts.total}</td>
            </tr>
            <tr>
              <td>Coop</td>
              <td>{counts.coop}</td>
            </tr>
            <tr>
              <td>FIR</td>
              <td>{counts.FIR}</td>
            </tr>
            <tr>
              <td>SOP</td>
              <td>{counts.SOP}</td>
            </tr>
            <tr>
              <td>JUN</td>
              <td>{counts.JUN}</td>
            </tr>
            <tr>
              <td>SEN</td>
              <td>{counts.SEN}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}
