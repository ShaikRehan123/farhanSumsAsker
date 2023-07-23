import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2Icon } from "lucide-react";

const Home = () => {
  const [noOfSumDigits, setNoOfSumDigits] = useState(6);
  const [numberDigitLength, setNumberDigitLength] = useState(2);

  const [noOfSums, setNoOfSums] = useState(24);
  const [voiceRate, setVoiceRate] = useState(0.8);

  const [sums, setSums] = useState<string[]>([]);

  const calculate = () => {
    const randomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const getRandomSign = () => (Math.random() < 0.5 ? "+" : "-");

    const generateRandomNumber = (digitLength: number) => {
      const max = Math.pow(10, digitLength) - 1;
      const min = Math.pow(10, digitLength - 1);
      return randomInt(min, max);
    };

    const sumsArray = [];
    for (let i = 0; i < noOfSums; i++) {
      let sum = "";

      for (let j = 0; j < noOfSumDigits; j++) {
        if (j > 0) {
          sum += ` ${getRandomSign()} `;
        }
        sum += generateRandomNumber(numberDigitLength);
      }

      // if sum is in negative get another sum else continue
      if (eval(sum) < 0) {
        i--;
        continue;
      }

      sumsArray.push(sum);
    }

    setSums(sumsArray);
  };

  const speakOutSum = (sum: string) => () => {
    sum = sum.replace(/\+/g, "plus").replace(/-/g, "minus");

    const utterance = new SpeechSynthesisUtterance(sum);
    utterance.rate = voiceRate;
    utterance.lang = "en-US";

    // default female voice which is available in all browsers
    utterance.voice = speechSynthesis.getVoices()[0];

    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col bg-gray-900 min-h-screen py-4 gap-8">
      <h1 className="text-2xl font-bold text-white text-center">
        Farhan Sum Asker
      </h1>
      <div className="grid grid-cols-2 gap-4 px-4">
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="noOfSumDigits" className="text-white">
            No of Sum Digits
          </Label>
          <Input
            type="number"
            id="noOfSumDigits"
            placeholder="No of Sum Digits"
            value={noOfSumDigits}
            onChange={(e) => {
              if (e.target.value === "") {
                setNoOfSumDigits(0);
                return;
              }
              setNoOfSumDigits(parseInt(e.target.value));
            }}
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="numberDigitLength" className="text-white">
            Number Digit Length
          </Label>
          <Input
            type="number"
            id="numberDigitLength"
            placeholder="Number Digit Length"
            value={numberDigitLength}
            onChange={(e) => {
              if (e.target.value === "") {
                setNumberDigitLength(0);
                return;
              }
              setNumberDigitLength(parseInt(e.target.value));
            }}
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="noOfSums" className="text-white">
            No of Sums
          </Label>
          <Input
            type="number"
            id="noOfSums"
            placeholder="No of Sums"
            value={noOfSums}
            onChange={(e) => {
              if (e.target.value === "") {
                setNoOfSums(0);
                return;
              }
              setNoOfSums(parseInt(e.target.value));
            }}
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="voiceRate" className="text-white">
            Voice Rate
          </Label>
          <Input
            type="number"
            id="voiceRate"
            placeholder="Voice Rate"
            value={voiceRate}
            step={0.1}
            onChange={(e) => {
              if (e.target.value === "") {
                setVoiceRate(0);
                return;
              }
              setVoiceRate(parseFloat(e.target.value));
            }}
          />
        </div>

        <div className="flex flex-col w-full gap-2 col-span-2">
          <Label htmlFor="sums" className="text-white">
            ‎
          </Label>
          <Button
            onClick={calculate}
            className="w-full bg-slate-950 text-white hover:bg-slate-700"
          >
            Calculate
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 px-4">
        {sums.map((sum, index) => {
          // remove spaces and seperate each sum by sign
          let updatedSums = sum
            .replace(/\s/g, "")
            .replace(/\+/g, " + ")
            .replace(/-/g, " - ")
            .split(" ");

          // attach the sign to the number, if it's the first number then it's positive
          updatedSums = updatedSums.map((sum, index) => {
            if (index === 0) {
              return `+${sum}`;
            }
            if (sum === "+" || sum === "-") {
              // return with next index number,
              // if it's the last index then return the sign
              return index + 1 < updatedSums.length
                ? `${sum}${updatedSums[index + 1]}`
                : sum;
            }
            return sum;
          });

          // remove any numbers that doesn't have sign infront of it
          updatedSums = updatedSums.filter(
            (sum) => sum[0] === "+" || sum[0] === "-"
          );

          return (
            <div
              key={index}
              className="flex gap-2 flex-col items-center justify-center bg-slate-950 text-white rounded-md py-2 px-4 relative"
            >
              {updatedSums.map((sum, index) => {
                return (
                  <div key={index}>
                    <span>{sum}</span>
                  </div>
                );
              })}

              <div className="border border-solid border-white w-full mt-2 text-center">
                <span className="font-bold">{eval(sum)}</span>
              </div>
              <div
                className="absolute -top-2 -right-2 p-2 bg-white rounded-full cursor-pointer hover:bg-gray-200 transition-all"
                onClick={speakOutSum(sum)}
                title="Speak out sum"
              >
                <Volume2Icon size={24} className="text-slate-950" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
