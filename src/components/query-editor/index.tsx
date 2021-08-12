import { useCallback, useContext, useState } from "react";
import { QueryExecResult } from "sql.js";
import PerformanceContext from "../../context/performance";
import { mainDatabaseOperator } from "../../db/mainOperator";
import { ResultsTable } from "./query-results";

export const SqlQueryEditor = () => {
  const [error, setError] = useState<Error | null>(null);
  const [query, setQuery] = useState("select * from data;");
  const [queryDuration, setQueryDuration] = useState<number | null>(null);
  const [results, setResults] = useState<QueryExecResult[]>([]);

  const { logReadRanges } = useContext(PerformanceContext);

  const exec = useCallback(
    async (sql) => {
      try {
        setResults([]);
        const { results, meta } = await mainDatabaseOperator.exec(sql);
        setResults(results); // an array of objects is returned
        logReadRanges([
          { source: "query-editor", start: meta.start, end: meta.end },
        ]);
        setQueryDuration(meta.durationMS);
        setError(null);
      } catch (err) {
        // exec throws an error when the SQL statement is invalid
        setError(err);
        setQueryDuration(null);
        setResults([]);
      }
    },
    [logReadRanges]
  );

  return (
    <div style={{ margin: 12, marginBottom: 48 }}>
      <h2>Query</h2>
      <textarea
        style={{
          border: "1px solid black",
          width: "calc(100% - 24px)",
          padding: 8,
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter some SQL. No inspiration ? Try “select sqlite_version()”"
      ></textarea>
      {query.length > 0 && <button onClick={() => exec(query)}>Run</button>}

      <h4>Examples</h4>
      <ul>
        <li>select sqlite_version();</li>
        <li>select * from data;</li>
        <li>select * from data where name='apple';</li>
      </ul>

      <pre className="error">{(error || "").toString()}</pre>

      {queryDuration && (
        <>
          <h2>Results</h2>
          <i>Duration: {queryDuration.toFixed(1)} MS</i>
          <pre>
            {
              // results contains one object per select statement in the query
              results.map(({ columns, values }, i) => (
                <ResultsTable
                  key={i}
                  queryID={i}
                  columns={columns}
                  values={values}
                />
              ))
            }
          </pre>
        </>
      )}
    </div>
  );
};
