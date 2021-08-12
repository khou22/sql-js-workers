import { useMemo } from "react";
import { SqlValue } from "sql.js";

type ResultsTableProps = {
  columns: string[];
  values: SqlValue[][];
};

export const ResultsTable: React.FC<ResultsTableProps> = ({
  columns,
  values,
}) => {
  const rowNodes = useMemo(() => {
    const clippedValues = values.slice(0, 100);
    return clippedValues.map((row, i) => (
      <tr key={i}>
        {row?.map((value, i) => (
          <td key={i}>{value}</td>
        ))}
      </tr>
    ));
  }, [values]);

  return (
    <table>
      <thead>
        <tr>
          {columns.map((columnName, i) => (
            <td key={i}>{columnName}</td>
          ))}
        </tr>
      </thead>

      <tbody>{rowNodes}</tbody>

      <tfoot>{values.length} Results</tfoot>
    </table>
  );
};
