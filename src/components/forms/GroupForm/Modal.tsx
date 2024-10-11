import { getAllUsers } from '@/api/users';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface FormData {
  selectedOptions: string[];
}

const MultiselectModal: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<FormData>({ selectedOptions: [] });
    const [members, setMembers] = useState<any>(false);

    const getTheUsers = () => {
        getAllUsers().then(setMembers)
    }
    useEffect(() => {
        getTheUsers();
    }, [])

    const handleClose = () => setShowModal(false);
    const handleOpen = () => setShowModal(true);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ selectedOptions });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Selected Options', formData.selectedOptions);
        handleClose();
    };

    return (
        <>
            <Button variant="primary" onClick={handleOpen}>
                Open Multiselect Modal
            </Button>

            {/* MODAL FOR ADDING FRIENDS TO GROUP */}
            <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Friends</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formMultiselect">
                        <Form.Label>Select people to join the group</Form.Label>
                        <Form.Select
                            multiple
                            value={formData.selectedOptions}
                            onChange={handleChange}
                            style={{ height: '150px'}}
                        >
                            {members.map((member: any) => (
                                <option key={member.id}>
                                    {member.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {/* <Button variant="primary" type="submit">
                        Submit
                    </Button> */}
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