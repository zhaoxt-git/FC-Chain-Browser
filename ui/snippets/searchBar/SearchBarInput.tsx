import type { HTMLChakraProps } from '@chakra-ui/react';
import { chakra, Center, Box } from '@chakra-ui/react';
import React from 'react';
import type { ChangeEvent, FormEvent, FocusEvent } from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import IconSvg from 'ui/shared/IconSvg';

const nameServicesFeature = config.features.nameServices;

interface Props extends Omit<HTMLChakraProps<'form'>, 'onChange'> {
  onChange?: (value: string) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onBlur?: (event: FocusEvent<HTMLFormElement>) => void;
  onFocus?: () => void;
  onHide?: () => void;
  onClear?: () => void;
  onFormClick?: (event: React.MouseEvent<HTMLFormElement>) => void;
  isHeroBanner?: boolean;
  isSuggestOpen?: boolean;
  value?: string;
  readOnly?: boolean;
}

const SearchBarInput = (
  { onChange, onSubmit, isHeroBanner, isSuggestOpen, onFocus, onBlur, onHide, onClear, onFormClick, value, readOnly, ...rest }: Props,
  ref: React.ForwardedRef<HTMLFormElement>,
) => {
  const innerRef = React.useRef<HTMLFormElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current as HTMLFormElement, []);
  const isMobile = useIsMobile();

  const borderWidthHeroBanner = useColorModeValue(
    config.UI.homepage.heroBanner?.search?.border_width?.[0] ?? '0px',
    config.UI.homepage.heroBanner?.search?.border_width?.[1] ?? '0px',
  );

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  }, [ onChange ]);

  const handleKeyPress = React.useCallback((event: KeyboardEvent) => {
    if (isMobile) {
      return;
    }

    switch (event.key) {
      case '/': {
        if ([ 'INPUT', 'TEXTAREA' ].includes((event.target as HTMLElement).tagName)) {
          break;
        }

        if (!isSuggestOpen) {
          event.preventDefault();
          innerRef.current?.querySelector('input')?.focus();
          onFocus?.();
        }
        break;
      }
      case 'Escape': {
        if (isSuggestOpen) {
          innerRef.current?.querySelector('input')?.blur();
          onHide?.();
        }
        break;
      }
    }
  }, [ isMobile, isSuggestOpen, onFocus, onHide ]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [ handleKeyPress ]);

  const getPlaceholder = () => {
    return `Search by txn hash / block / address...`;
  };

  const startElement = (
    <IconSvg
      name="search"
      boxSize={ 5 }
      ml={ isHeroBanner ? { base: 4, lg: 6 } : 4 }
      mr={ 2 }
    />
  );

  const endElement = (
    <>
      <ClearButton onClick={ onClear } visible={ Boolean(value?.length) } mx={ 2 }/>
      { !isMobile && (
        isHeroBanner ? (
          <Box className="search-scan-text" cursor="pointer" onClick={(e) => {
            if (innerRef.current) {
              innerRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
          }}>SCAN</Box>
        ) : (
          <Center
            boxSize="20px"
            mr={ 2 }
            borderRadius="sm"
            borderWidth="1px"
            borderColor="input.element"
          >
            /
          </Center>
        )
      ) }
    </>
  );

  return (
    <chakra.form
      ref={ innerRef }
      noValidate
      onSubmit={ onSubmit }
      onBlur={ onBlur }
      onClick={ onFormClick }
      w="100%"
      backgroundColor={ isHeroBanner ? 'transparent' : 'bg.primary' }
      borderRadius="0"
      position="relative"
      zIndex={ isSuggestOpen ? 'modal' : 'auto' }
      { ...rest }
    >
      <InputGroup
        startElement={ startElement }
        endElement={ endElement }
      >
        <Input
          size={{ base: isHeroBanner ? 'md' : 'sm', lg: 'md' }}
          placeholder={ getPlaceholder() }
          value={ value }
          onChange={ handleChange }
          onFocus={ onFocus }
          tabIndex={ readOnly ? -1 : 0 }
          borderWidth={ isHeroBanner ? '1px' : '1px' }
          borderStyle="solid"
          borderRadius="0"
          borderColor={{ _light: 'blackAlpha.300', _dark: isHeroBanner ? 'rgba(255, 255, 255, 0.05)' : 'whiteAlpha.200' }}
          color={{ _light: 'black', _dark: '#e5c158' }}
          backgroundColor={{ _light: 'dialog.bg', _dark: 'rgba(10, 10, 12, 0.8)' }}
          paddingInlineStart={{ base: '3rem !important', lg: isHeroBanner ? '3.5rem !important' : '3rem !important' }}
          _hover={{ borderColor: isHeroBanner ? 'rgba(229, 193, 88, 0.3)' : 'rgba(229, 193, 88,0.6)', bg: isHeroBanner ? 'rgba(15, 15, 18, 0.9)' : undefined }}
          _focusWithin={{ 
            _placeholder: { color: 'rgba(229, 193, 88,0.5)' }, 
            borderColor: isHeroBanner ? 'rgba(229, 193, 88, 0.5)' : '#e5c158', 
            boxShadow: 'none',
            backgroundColor: isHeroBanner ? 'rgba(15, 15, 18, 0.9)' : 'rgba(10, 10, 12, 0.8)'
          }}
          enterKeyHint="search"
        />
      </InputGroup>
    </chakra.form>
  );
};

export default React.memo(React.forwardRef(SearchBarInput));
