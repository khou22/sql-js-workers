import { useCallback, useState } from "react";
import { QueryExecResult } from "sql.js";
import { mainDatabaseOperator } from "../../db/mainOperator";
import { ResultsTable } from "./query-results";

export const SqlQueryEditor = () => {
  const [error, setError] = useState<Error | null>(null);
  const [queryDuration, setQueryDuration] = useState<number | null>(null);
  const [results, setResults] = useState<QueryExecResult[]>([]);

  const exec = useCallback(async (sql) => {
    try {
      const { results, meta } = await mainDatabaseOperator.exec(sql);
      setResults(results); // an array of objects is returned
      setQueryDuration(meta.durationMS);
      setError(null);
    } catch (err) {
      // exec throws an error when the SQL statement is invalid
      setError(err);
      setQueryDuration(null);
      setResults([]);
    }
  }, []);

  return (
    <div style={{ margin: 12, marginBottom: 48 }}>
      <h2>Query</h2>
      <textarea
        style={{
          border: "1px solid black",
          width: "calc(100% - 24px)",
          padding: 8,
        }}
        onChange={(e) => exec(e.target.value)}
        placeholder="Enter some SQL. No inspiration ? Try “select sqlite_version()”"
      ></textarea>

      <h4>Examples</h4>
      <ul>
        <li>select sqlite_version();</li>
        <li>select * from data;</li>
      </ul>

      <pre className="error">{(error || "").toString()}</pre>

      {queryDuration && (
        <>
          <h2>Results</h2>
          <i>Duration: {queryDuration} MS</i>
          <pre>
            {
              // results contains one object per select statement in the query
              results.map(({ columns, values }, i) => (
                <ResultsTable key={i} columns={columns} values={values} />
              ))
            }
          </pre>
        </>
      )}
    </div>
  );
};
