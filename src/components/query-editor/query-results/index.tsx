import { useMemo } from "react";
import { SqlValue } from "sql.js";

type ResultsTableProps = {
  queryID: number;
  columns: string[];
  values: SqlValue[][];
};

export const ResultsTable: React.FC<ResultsTableProps> = ({
  queryID,
  columns,
  values,
}) => {
  const rowNodes = useMemo(() => {
    const clippedValues = values.slice(0, 10);
    return clippedValues.map((row, i) => (
      <tr key={i}>
        {row?.map((value, i) => {
          const size =
            typeof value === "object"
              ? value?.byteLength
              : value.toString.length;
          let str = value?.toString() || "null";
          if (str.length > 20) {
            str = `${str.slice(0, 20)}... [size = ${size}]`;
          }
          return (
            <td className="query-results-column" key={i}>
              {str}
            </td>
          );
        })}
      </tr>
    ));
  }, [values]);

  return (
    <>
      <h3>
        Query {queryID} ({values.length} rows)
      </h3>
      <table style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            {columns.map((columnName, i) => (
              <th key={i}>{columnName}</th>
            ))}
          </tr>
        </thead>

        <tbody>{rowNodes}</tbody>

        <tfoot>
          <tr>
            <th scope="row">Total rows</th>
            <td>{values.length}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};
