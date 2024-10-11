import { getAllUsers } from '@/api/users';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface MultiselectModalProps {
    onSelectMembers: (selectedMembers: string[]) => void;
}

interface UserDB {
    _id: string; //primary key from mongo
    uid: string; //primary key from google
    name: string;
    phone: string;
    email: string;
    address: {
      street: string;
      zip: number;
      city: string;
      state: string;
      private: boolean;
      coordinates: {
        lat: number;
        long: number;
      };
    };
    friends: string[];
}

const MultiselectModal: React.FC<MultiselectModalProps> = ({ onSelectMembers }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [members, setMembers] = useState<UserDB[]>([]);

    const getTheUsers = () => {
        (getAllUsers() as Promise<UserDB[]>).then((users) => {
            setMembers(users);
        }).catch((err) => {
            console.error('youre dumb', err);
            setMembers([]);
        });
    }

    useEffect(() => {
        getTheUsers();
    }, [])

    const handleClose = () => setShowModal(false);
    const handleOpen = () => setShowModal(true);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedOptions(selected);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSelectMembers(selectedOptions);
        handleClose();
    };

    return (
        <>
            <Button variant="primary" onClick={handleOpen}>
                Open Multiselect Modal
            </Button>

            {/* MODAL FOR ADDING FRIENDS TO GROUP */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Add Friends</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formMultiselect">
                            <Form.Label>Select people to join the group</Form.Label>
                            <Form.Select
                                multiple
                                value={selectedOptions}
                                onChange={handleChange}
                                style={{ height: '150px'}}
                            >
                                {members.map((member: UserDB) => (
                                    <option key={member._id}>
                                        {member.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MultiselectModal;