import PropTypes from 'prop-types';
import { Button, Box, Text, useToast } from '@chakra-ui/react';
import hljs from 'highlight.js';
import java from 'highlight.js/lib/languages/java';
import { Editor as MonacoEditor } from '@monaco-editor/react';

// Register the Java language
hljs.registerLanguage('java', java);

const CodeHighlighter = ({ codeString, slipNo, question, language, id, onDelete }) => {
    const toast = useToast();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(codeString).then(() => {
            toast({
                title: 'Copied to clipboard.',
                description: 'The code has been copied successfully.',
                status: 'success',
                duration: 3000,
                isClosable: false,
                position: 'top',
            });
        }).catch(err => {
            console.error('Could not copy text: ', err);
            toast({
                title: 'Copy failed.',
                description: 'Could not copy the code.',
                status: 'error',
                duration: 3000,
                isClosable: false,
                position: 'top',
            });
        });
    };

    const deleteCode = async () => {
        try {
            const response = await fetch(`https://code-box-server.onrender.com/api/codes/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onDelete(id); // Notify parent to remove this code
                toast({
                    title: 'Code deleted.',
                    description: 'The code has been deleted successfully.',
                    status: 'success',
                    duration: 3000,
                    isClosable: false,
                    position: 'top',
                });
            } else {
                throw new Error('Code not found.');
            }
        } catch (error) {
            console.error('Error deleting code:', error);
            toast({
                title: 'Delete failed.',
                description: 'Could not delete the code.',
                status: 'error',
                duration: 3000,
                isClosable: false,
                position: 'top',
            });
        }
    };

    return (
        <Box position="relative" w="47%" m={2} p={4} bg="gray.700">
            <Box>
                <Text fontSize="md" color="gray.400" mb={1}>
                    <strong>Slip No:</strong> {slipNo}
                </Text>
                <Text fontSize="md" color="gray.400" mb={1}>
                    <strong>Question:</strong> {question}
                </Text>
                <Text fontSize="md" color="gray.400" mb={1}>
                    <strong>Language:</strong> {language}
                </Text>
                <Box position='absolute' top={5} right={5}>
                    <Button
                        colorScheme="teal"
                        onClick={copyToClipboard}
                        size="xs"
                        mr='2'
                    >
                        Copy Code
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={deleteCode}
                        size="xs"
                        p={0}
                    >
                        <i className="fa-solid fa-trash"></i>
                    </Button>
                </Box>
            </Box>
            <MonacoEditor
                height="400px"
                language={language} // Use the appropriate language
                value={codeString}
                theme='vs-dark'
                options={{
                    selectOnLineNumbers: true,
                    readOnly: true,
                    automaticLayout: true,
                    minimap: { enabled: false },
                }}
            />
        </Box>
    );
};

CodeHighlighter.propTypes = {
    codeString: PropTypes.string.isRequired,
    slipNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Accept string or number
    question: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,// Add id here as well
    onDelete: PropTypes.func.isRequired, // Add onDelete prop type
};


export default CodeHighlighter;
