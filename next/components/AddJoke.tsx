import React, { useState } from "react";
import { Button } from "@/components/Button";

interface AddJokeProps {
  onSubmit: (setup: string, punchline: string) => void;
}

const AddJoke: React.FC<AddJokeProps> = ({ onSubmit }) => {
  const [setup, setSetup] = useState("");
  const [punchline, setPunchline] = useState("");

  const handleSubmit = () => {
    onSubmit(setup, punchline);
    setSetup("");
    setPunchline("");
  };

  return (
    <div className="flex flex-col items-center">
      <input
        className="border border-gray-300 rounded p-2 m-2"
        type="text"
        placeholder="Setup"
        value={setup}
        onChange={(e) => setSetup(e.target.value)}
      />
      <input
        className="border border-gray-300 rounded p-2 m-2"
        type="text"
        placeholder="Punchline"
        value={punchline}
        onChange={(e) => setPunchline(e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default AddJoke;
