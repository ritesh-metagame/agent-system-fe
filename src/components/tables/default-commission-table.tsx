import React from "react";

const DefaultCommissionTable = () => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid black", textAlign: "left" }}></th>
          <th style={{ border: "1px solid black", textAlign: "left" }}>
            Commission available for payout
            <br />
            <span style={{ fontSize: "smaller", fontStyle: "italic" }}>
              *Based on unsettled completed commission periods
            </span>
          </th>
          <th style={{ border: "1px solid black", textAlign: "left" }}>
            Settled All Time
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid black", fontWeight: "bold" }}>ALL OPERATORS</td>
          <td style={{ border: "1px solid black" }}></td>
          <td style={{ border: "1px solid black" }}></td>
        </tr>
      </tbody>
    </table>
  );
};

export default DefaultCommissionTable;