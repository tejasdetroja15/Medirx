"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";

export default function MedicineSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchMedicines = () => {
    // In real application call an API to search for medicines
    const dummyResults = [
      { id: 1, name: "Paracetamol", price: 5.99 },
      { id: 2, name: "Ibuprofen", price: 6.99 },
      { id: 3, name: "Aspirin", price: 4.99 },
    ];
    setSearchResults(dummyResults);
  };

  return (
    <section id="medicine-search" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Find and Order Medicines
        </h2>
        <Card className="max-w-2xl mx-auto search-card">
          <CardHeader className="search-head">
            Search for Medicines
          </CardHeader>
          <CardBody>
            <div className="flex mb-4">
              <Input
                type="text"
                placeholder="Enter medicine name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow mr-2"
              />
              <Button onPress={searchMedicines}>Search</Button>
            </div>
            {searchResults.length > 0 && (
              <div>
                <h3 className="font-bold mb-2">Search Results:</h3>
                <ul className="space-y-2">
                  {searchResults.map((medicine) => (
                    <li
                      key={medicine.id}
                      className="flex justify-between items-center"
                    >
                      <span>{medicine.name}</span>
                      <div>
                        <span className="mr-2">
                          ${medicine.price.toFixed(2)}
                        </span>
                        <Button variant="outline" size="sm">
                          Add to Cart
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
