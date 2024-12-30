import React, { FC, useState, useEffect, FormEvent, useRef } from 'react';
import useApi from '../hooks/useApi';
import GoalCard from '../components/GoalCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import Input from '../components/Input';

interface Goal {
  id: string;
  name: string;
  target: number;
  progress: number;
}

const Dashboard: FC = () => {
  // State for managing goals, loading, errors, modal, new goal name and target
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState<number | undefined>(undefined);
    const [formErrors, setFormErrors] = useState<{ name?: string; target?: string }>({});


    // useRef for focusing input field
    const inputRef = useRef<HTMLInputElement>(null);

  // useApi hook for making API requests
  const { get, post } = useApi();

    // Fetch goals from the API when the component mounts and when a goal is added or updated
    useEffect(() => {
        const fetchGoals = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await get<Goal[]>('/goals');
                if (data) {
                    setGoals(data);
                }
            } catch (apiError: any) {
                console.error('Error fetching goals:', apiError);
               setError(apiError?.message || 'Failed to fetch goals.');
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, [get]);


    // Function to open the add new goal modal
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    // Function to close the add new goal modal
    const handleCloseModal = () => {
      setIsModalOpen(false);
        setNewGoalName('');
        setNewGoalTarget(undefined);
        setFormErrors({});
    };

    // Function to handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
      if (name === 'newGoalName') {
        setNewGoalName(value);
          setFormErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
      } else if (name === 'newGoalTarget') {
        const parsedValue = Number(value);
          if(isNaN(parsedValue)){
                setNewGoalTarget(undefined);
              setFormErrors((prevErrors) => ({ ...prevErrors, target: 'Target must be a number' }));
          } else {
              setNewGoalTarget(parsedValue);
            setFormErrors((prevErrors) => ({ ...prevErrors, target: undefined }));
          }
      }
    };


    // Function to handle adding new goal
    const handleAddNewGoal = async (e: FormEvent) => {
        e.preventDefault();
      setFormErrors({});

        let validationErrors: { name?: string; target?: string } = {};
        if (!newGoalName.trim()) {
          validationErrors.name = 'Name is required';
        }

        if (newGoalTarget === undefined || newGoalTarget <= 0) {
            validationErrors.target = 'Target must be a number greater than 0';
        }
        if(Object.keys(validationErrors).length > 0){
            setFormErrors(validationErrors);
            return
        }

        try {
            await post<Goal>('/goals', {
                name: newGoalName,
                target: newGoalTarget,
                progress: 0,
            });
            // Fetch goals again to update the list
            const data = await get<Goal[]>('/goals');
                if (data) {
                    setGoals(data);
                }
            handleCloseModal();
          console.log('Goal added successfully');
        } catch (apiError: any) {
            console.error('Error adding new goal:', apiError);
            setError(apiError?.message || 'Failed to add new goal.');
        }
    };

    useEffect(() => {
          if (isModalOpen && inputRef.current) {
            inputRef.current.focus();
          }
        }, [isModalOpen]);

  return (
      <div className="flex flex-col min-h-screen bg-gray-100">
          <Header />
        <main className="flex-grow container mx-auto p-4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-text mb-4">Dashboard</h2>
              <button
                  className="bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={handleOpenModal}
              >
                Add Goal
            </button>
          </div>


            {loading && <p className="text-gray-600">Loading goals...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && goals.length === 0 && (
                <p className="text-gray-600">No goals set yet.</p>
          )}
          {!loading && !error && goals.length > 0 && (
              <div className="space-y-4">
                  {goals.map((goal) => (
                      <GoalCard
                          key={goal.id}
                          id={goal.id}
                          name={goal.name}
                          target={goal.target}
                          progress={goal.progress}
                      />
                  ))}
              </div>
          )}

          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Add New Goal"
          >
            <form onSubmit={handleAddNewGoal} className="space-y-4">
              <Input
                  label="Goal Name"
                  id="newGoalName"
                  name="newGoalName"
                  type="text"
                  placeholder="Enter goal name"
                  value={newGoalName}
                  onChange={handleChange}
                  error={formErrors.name}
                  required
                  ref={inputRef}
              />
                <Input
                    label="Target"
                    id="newGoalTarget"
                    name="newGoalTarget"
                    type="number"
                    placeholder="Enter target"
                    value={newGoalTarget === undefined ? '' : String(newGoalTarget)}
                    onChange={handleChange}
                    error={formErrors.target}
                    required
                  />

              <div className="flex justify-end mt-4">
                  <Button type="submit" text="Add Goal" variant="primary" />
              </div>

            </form>
          </Modal>

        </main>
        <Footer />
      </div>
  );
};

export default Dashboard;