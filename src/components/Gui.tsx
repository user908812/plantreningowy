import { useRef, useState, useEffect } from "react";

interface Exercise {
    name: string;
    powtorzenia: number;
}

function Gui() {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const repeatsRef = useRef<HTMLInputElement | null>(null);

    const [exercises, setExercises] = useState<Exercise[]>(() => {
        const storedExercises = localStorage.getItem('exercises');
        return storedExercises ? JSON.parse(storedExercises) : [{
            name: 'Przysiady',
            powtorzenia: 15
        }];
    });

    useEffect((): void => {
        localStorage.setItem('exercises', JSON.stringify(exercises));
    }, [exercises]);

    function addExercise(e: React.FormEvent) {
        e.preventDefault();

        const exerciseName = inputRef.current?.value.trim();
        const numberOfRepeats = repeatsRef.current?.valueAsNumber;

        if (exerciseName && numberOfRepeats && numberOfRepeats > 0) {
            setExercises([...exercises, {
                name: exerciseName,
                powtorzenia: numberOfRepeats,
            }]);

            if (inputRef.current && repeatsRef.current) {
                inputRef.current.value = '';
                repeatsRef.current.value = '10';
                inputRef.current.focus();
            }
        }
    }

    function removeExercise(index: number) {
        setExercises(exercises.filter((_, i) => i !== index));
    }

    function updateRepeats(index: number, delta: number) {
        setExercises(exercises.map((exercise, i) => i === index ? {
            ...exercise,
            powtorzenia: Math.max(0, exercise.powtorzenia + delta)
        } : exercise));
    }

    function updateAllRepeats(delta: number) {
        setExercises(exercises.map(exercise => ({
            ...exercise,
            powtorzenia: Math.max(0, exercise.powtorzenia + delta)
        })));
    }

    function setExerciseDone(e: React.ChangeEvent<HTMLInputElement>) {
        const parentElement = e.target.parentElement;
        if (parentElement) {
            if (parentElement.style.textDecoration !== 'line-through') {
                parentElement.style.textDecoration = 'line-through';
            } else {
                parentElement.style.textDecoration = 'none';
            }
        }
    }

    return (
        <div className="gui">
            <header>
                <form onSubmit={addExercise}>
                    <div>
                        <label htmlFor="exerciseName">Nazwa ćwiczenia: </label>
                        <input className="inputText" ref={inputRef} type="text" name="exerciseName" id="exerciseName" placeholder="Wyciskanie na klatę..." required autoFocus autoComplete="on" />
                    </div>

                    <div>
                        <label htmlFor="liczbaPowtorzen">Ilość powtórzeń: </label>
                        <input className="inputText" ref={repeatsRef} type="number" name="liczbaPowtorzen" id="liczbaPowtorzen" min={1} defaultValue={10} />
                    </div>

                    <div>
                        <button className="addExerciseToListBtn" type="submit">Dodaj</button>
                    </div>
                </form>
            </header>

            <main>
                <h2>Twój plan treningowy:</h2>
                <hr />
                <ul>
                    {exercises.map((exercise, i) => (
                        <li key={i} className="liElement">
                            <div>
                                <input className="isDoneCheckbox" type="checkbox" onChange={setExerciseDone} />{exercise.name} (<span>{exercise.powtorzenia}</span> powtórzeń)
                                <button className="increaseBtn" onClick={() => updateRepeats(i, 1)}>+</button>
                                <button className="decreaseBtn" onClick={() => updateRepeats(i, -1)}>-</button>
                                <button className="removeExerciseBtn" onClick={() => removeExercise(i)}>x</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <button id="increaseAllReps" className="repeatsButton" onClick={() => updateAllRepeats(1)}>[➕] Zwiększ powtórzenia</button>
                <button id="decreaseAllReps" className="repeatsButton" onClick={() => updateAllRepeats(-1)}>[➖] Zmniejsz powtórzenia</button>
            </main>
        </div>
    );
}

export default Gui;