import React, { useState } from 'react';
import {
  ButtonText,
  Center,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  HStack,
  Input,
  InputField,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  VStack,
  Text,
  Button,
  Switch,
  Textarea,
  TextareaInput,
  FormControlHelper,
  FormControlHelperText,
  ButtonGroup,
  Box,
} from '@gluestack-ui/themed';
import {useTranslation} from "react-i18next";

const ImportPrivateKey = ({ saveKey }) => {
  const { t } = useTranslation();
  const [privateKey, setPrivateKey] = useState('');
  const [showModal, setShowModal] = useState(false);
  return (
    <Box>
      <Button
        py='$2.5'
        px='$3'
        onPress={() => {
          setShowModal(true);
        }}>
        <ButtonText>{t('wallet.import')}</ButtonText>
      </Button>
      <Modal
        avoidKeyboard={true}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}>
        <ModalBackdrop />
        <ModalContent maxWidth='$96'>
          <ModalBody p='$5'>
            <VStack space='xs' mb='$4'>
              <Heading>{t('wallet.import')}</Heading>
              <Text size='sm'>
                {t('import.body.text.a')}
              </Text>
            </VStack>
            <VStack py='$2' space='xl'>
              <FormControl>
                <FormControlHelper>
                  <FormControlHelperText>
                    {t('import.body.text.b')}
                  </FormControlHelperText>
                </FormControlHelper>

                <Input>
                  <InputField value={privateKey} onChangeText={setPrivateKey} />
                </Input>

                {/*<Textarea*/}
                {/*  size='md'*/}
                {/*  isReadOnly={false}*/}
                {/*  isInvalid={false}*/}
                {/*  isDisabled={false}*/}
                {/*  w='$64'>*/}
                {/*  <TextareaInput*/}
                {/*    placeholder='Your text goes here...'*/}
                {/*    value={privateKey}*/}
                {/*    onChangeText={setPrivateKey}*/}
                {/*  />*/}
                {/*</Textarea>*/}
              </FormControl>
            </VStack>

            <ButtonGroup space='md' alignSelf='center'>
              <Button
                variant='outline'
                py='$2.5'
                action='secondary'
                onPress={() => {
                  setShowModal(false);
                  setPrivateKey('');
                }}>
                <ButtonText fontSize='$sm' fontWeight='$medium'>
                  {t('button.press.b')}
                </ButtonText>
              </Button>
              <Button
                variant='solid'
                bg='$success700'
                borderColor='$success700'
                onPress={() => {
                  setShowModal(false);
                  saveKey(privateKey);
                  setPrivateKey('');
                }}>
                <ButtonText fontSize='$sm' fontWeight='$medium'>
                  {t('button.press.a')}
                </ButtonText>
              </Button>
            </ButtonGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ImportPrivateKey;
