import PropTypes from 'prop-types';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    useToast
} from '@chakra-ui/react';
import { useState } from 'react';

const AddNewCodePopover = ({ onAddCode }) => {
    const [slipNo, setSlipNo] = useState('');
    const [question, setQuestion] = useState('');
    const [language, setLanguage] = useState('');
    const [code, setCode] = useState('');
    const toast = useToast();

    const handleSubmit = async () => {
        if (!slipNo || !question || !language || !code) {
            toast({
                title: 'Error',
                description: 'Please fill in all the fields.',
                status: 'error',
                duration: 3000,
                isClosable: false,
                position: 'top'
            });
            return;
        }

        try {
            const newCode = { id: Date.now(), slip_no: slipNo, question, language, code }; // Generate unique ID
            const response = await fetch('https://code-box-server.onrender.com/api/codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCode),
            });

            if (response.ok) {
                onAddCode(newCode); // Call the function to add the new code to the state
                toast({
                    title: 'Success',
                    description: 'Code added successfully.',
                    status: 'success',
                    duration: 3000,
                    isClosable: false,
                    position: 'top'
                });
                setSlipNo('');
                setQuestion('');
                setLanguage('');
                setCode('');
            } else {
                throw new Error('Failed to add code');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: false,
                position: 'top'
            });
        }
    };

    return (
        <Popover>
            <PopoverTrigger>
                <Button colorScheme="teal" size='sm' ml={2} py='20px' fontSize='15px' fontWeight='900'>Add New Code</Button>
            </PopoverTrigger>
            <PopoverContent bg="gray.700" position='absolute' right='0' w='500px'>
                <PopoverCloseButton />
                <PopoverHeader>Add New Code</PopoverHeader>
                <PopoverBody bg="gray.800">
                    <FormControl mb={3}>
                        <FormLabel>Slip No</FormLabel>
                        <Input
                            value={slipNo}
                            onChange={(e) => setSlipNo(e.target.value)}
                            placeholder="Enter Slip No"
                        />
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>Question</FormLabel>
                        <Input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Enter Question"
                        />
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>Language</FormLabel>
                        <Input
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            placeholder="Enter Language"
                        />
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>Code</FormLabel>
                        <Textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter Code"
                            resize="vertical"
                            h='200px'
                        />
                    </FormControl>
                </PopoverBody>
                <PopoverFooter display="flex" justifyContent="flex-end">
                    <Button colorScheme="teal" onClick={handleSubmit}><i style={{ fontSize: '15px', fontWeight: '900' }} className="fa-solid fa-plus"></i></Button>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
};

// Adding PropTypes
AddNewCodePopover.propTypes = {
    onAddCode: PropTypes.func.isRequired // Ensures that onAddCode is a required function
};

export default AddNewCodePopover;
