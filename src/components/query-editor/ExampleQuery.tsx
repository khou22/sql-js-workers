type ExampleQueryProps = {
  query: string;
  onClick: (query: string) => void;
};

export const ExampleQueryItem: React.FC<ExampleQueryProps> = ({
  query,
  onClick,
}) => {
  return (
    <li style={{ cursor: "pointer" }} onClick={() => onClick(query)}>
      {query}
    </li>
  );
};
