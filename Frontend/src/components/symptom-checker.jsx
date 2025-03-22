"use client";

import { useState } from "react";
import { Button, CardBody } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Card, CardHeader, CardFooter} from "@nextui-org/react";


export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const addSymptom = () => {
    if (currentSymptom && !symptoms.includes(currentSymptom)) {
      setSymptoms([...symptoms, currentSymptom]);
      setCurrentSymptom("");
    }
  };

  const checkSymptoms = () => {
    // In a real application, this would call an API to get suggestions
    setSuggestions([
      "Rest and hydrate",
      "Consider over-the-counter pain relievers",
      "Consult a doctor if symptoms persist",
    ]);
  };

  return (
    <section id="symptom-checker" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Symptom Checker</h2>
        <Card className="max-w-2xl mx-auto sympton-card">
            <CardHeader className="sy-heading">Enter your symptoms</CardHeader>
          <CardBody>
            <div className="flex mb-4 sy-input">
              <Input
                type="text"
                placeholder="Enter a symptom"
                value={currentSymptom}
                onChange={(e) => setCurrentSymptom(e.target.value)}
                className="flex-grow mr-2"
              />
              <Button onPress={addSymptom}>Add</Button>
            </div>
            <div className="mb-4">
              {symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="inline-block bg-primary text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                >
                  {symptom}
                </span>
              ))}
            </div>
            <Button onPress={checkSymptoms} className="w-full">
              Get Suggestions
            </Button>
          </CardBody>
          <CardFooter>
            <div>
              {suggestions.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2">Suggestions:</h3>
                  <ul className="list-disc pl-5">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
