import { config } from "@fortawesome/fontawesome-svg-core";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, FormEvent, useState } from "react";
import { Accordion, Button, Form, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { octokit } from "./utils";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

config.autoAddCss = false;

interface IResults {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  owner: {
    login: string;
  };
}

function App() {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [results, setResults] = useState<IResults[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSearchLoading(true);

    try {
      const response = await octokit.request(`GET /search/repositories?q='${search}'&per_page=10`);
      setResults(response.data.items);
      setShowSearch(search);
      setIsSearchLoading(false);
    } catch (error: any) {
      console.error(error.message);
      setIsSearchLoading(false);
    }
  };

  return (
    <main className="m-3 d-flex justify-content-center">
      <section className="w-100" style={{ maxWidth: 768 }}>
        <Form onSubmit={handleSearch}>
          <Form.Group className="mb-3" controlId="search">
            <Form.Control
              type="text"
              placeholder="Enter repository name"
              value={search}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isSearchLoading} className="w-100">
            {isSearchLoading ? <Spinner animation="border" variant="light" size="sm" /> : "Search"}
          </Button>
        </Form>

        {showSearch && (
          <div data-testid="result-message" className="py-4">
            Showing repositories for "{showSearch}"
          </div>
        )}

        <Accordion>
          {results.length > 0 &&
            results.map((result, index) => (
              <Accordion.Item
                key={result.id}
                eventKey={`${index}`}
                data-testid={`accordion-item-${index}`}
              >
                <Accordion.Header>
                  <div className="text-truncate">{result.owner.login}</div>
                </Accordion.Header>
                <Accordion.Body className="p-0">
                  <div className="ms-3 my-3 p-2" style={{ backgroundColor: "ButtonShadow" }}>
                    <div className="d-flex justify-content-between">
                      <div>
                        <div className="fw-bold">{result.name}</div>
                        <div>{result.description}</div>
                      </div>
                      <div
                        className="d-flex align-items-center"
                        style={{ height: "max-content", gap: 5 }}
                      >
                        <span>{result.stargazers_count}</span>
                        <FontAwesomeIcon icon={faStar} />
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
        </Accordion>
      </section>
    </main>
  );
}

export default App;
