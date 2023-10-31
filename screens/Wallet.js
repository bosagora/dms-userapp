import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { styled } from '@gluestack-style/react';
import {
	AddIcon,
	Box,
	Button,
	ButtonIcon,
	VStack,
	Heading,
} from '@gluestack-ui/themed';

export default function Wallet({ navigation }) {
	return (
		<Box flex={1} justifyContent='center' bg='$primary950'>
			<VStack space='xl' reversed={false}>
				<Box alignItems='center'>
					<Heading mb='$4' color='white'>
						Sign in form using formik -:
					</Heading>
					<Button
						size='md'
						variant='solid'
						action='primary'
						isDisabled={false}
						isFocusVisible={false}
						onPress={() => navigation.navigate('Detail')}>
						<ButtonText>Go to Detail </ButtonText>
						<ButtonIcon as={AddIcon} />
					</Button>
				</Box>
			</VStack>
		</Box>
	);
}
const StyledButton = styled(Pressable, {
	bg: '$primary700',
	px: '$6',
	py: '$3',
	rounded: '$md',
	_dark: {
		bg: '$primary600',
	},
});
const ButtonText = styled(Text, {
	textAlign: 'center',
	fontSize: '$md',
	lineHeight: '$md',
	color: '$white',
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 24,
	},
	main: {
		flex: 1,
		justifyContent: 'center',
		maxWidth: 960,
		marginHorizontal: 'auto',
	},
	title: {
		fontSize: 64,
		fontWeight: 'bold',
	},
	subtitle: {
		fontSize: 36,
		color: '#38434D',
	},
});
