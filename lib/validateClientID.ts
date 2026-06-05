// Validate client ID/Passport based on country format
export interface IDValidationResult {
  isValid: boolean;
  message: string;
  idType?: 'national_id' | 'passport';
}

export const validateClientID = (country: string, idNumber: string, idType: 'national_id' | 'passport'): IDValidationResult => {
  // Remove spaces and dashes
  const cleaned = idNumber.replace(/[\s\-]/g, '');

  if (!cleaned) {
    return { isValid: false, message: 'ID/Passport number is required' };
  }

  // South Africa
  if (country.toLowerCase() === 'south africa') {
    if (idType === 'national_id') {
      // South African ID: 13 digits (YYMMDDGGGGGCC format)
      if (!/^\d{13}$/.test(cleaned)) {
        return {
          isValid: false,
          message: 'South African ID must be 13 digits (format: YYMMDDGGGGGCC)',
          idType: 'national_id',
        };
      }
      return { isValid: true, message: 'Valid South African ID', idType: 'national_id' };
    } else if (idType === 'passport') {
      // South African Passport: 8-9 characters (alphanumeric)
      if (!/^[A-Z0-9]{8,9}$/.test(cleaned)) {
        return {
          isValid: false,
          message: 'South African Passport must be 8-9 alphanumeric characters',
          idType: 'passport',
        };
      }
      return { isValid: true, message: 'Valid South African Passport', idType: 'passport' };
    }
  }

  // Nigeria
  if (country.toLowerCase() === 'nigeria') {
    if (idType === 'national_id') {
      // Nigerian National ID: 11 digits
      if (!/^\d{11}$/.test(cleaned)) {
        return {
          isValid: false,
          message: 'Nigerian ID must be 11 digits',
          idType: 'national_id',
        };
      }
      return { isValid: true, message: 'Valid Nigerian ID', idType: 'national_id' };
    } else if (idType === 'passport') {
      // Nigerian Passport: 9 alphanumeric characters
      if (!/^[A-Z0-9]{9}$/.test(cleaned)) {
        return {
          isValid: false,
          message: 'Nigerian Passport must be 9 alphanumeric characters',
          idType: 'passport',
        };
      }
      return { isValid: true, message: 'Valid Nigerian Passport', idType: 'passport' };
    }
  }

  // Kenya
  if (country.toLowerCase() === 'kenya') {
    if (idType === 'national_id') {
      // Kenyan ID: 6-8 digits
      if (!/^\d{6,8}$/.test(cleaned)) {
        return {
          isValid: false,
          message: 'Kenyan ID must be 6-8 digits',
          idType: 'national_id',
        };
      }
      return { isValid: true, message: 'Valid Kenyan ID', idType: 'national_id' };
    } else if (idType === 'passport') {
      // Kenyan Passport: 7 alphanumeric characters
      if (!/^[A-Z0-9]{7}$/.test(cleaned)) {
        return {
          isValid: false,
          message: 'Kenyan Passport must be 7 alphanumeric characters',
          idType: 'passport',
        };
      }
      return { isValid: true, message: 'Valid Kenyan Passport', idType: 'passport' };
    }
  }

  // Ethiopia
  if (country.toLowerCase() === 'ethiopia') {
    if (idType === 'national_id') {
      // Ethiopian ID: 9 digits
      if (!/^\d{9}$/.test(cleaned)) {
        return {
          isValid: false,
          message: 'Ethiopian ID must be 9 digits',
          idType: 'national_id',
        };
      }
      return { isValid: true, message: 'Valid Ethiopian ID', idType: 'national_id' };
    } else if (idType === 'passport') {
      // Ethiopian Passport: 8 alphanumeric characters
      if (!/^[A-Z0-9]{8}$/.test(cleaned)) {
        return {
          isValid: false,
          message: 'Ethiopian Passport must be 8 alphanumeric characters',
          idType: 'passport',
        };
      }
      return { isValid: true, message: 'Valid Ethiopian Passport', idType: 'passport' };
    }
  }

  // Zimbabwe
  if (country.toLowerCase() === 'zimbabwe') {
    if (idType === 'national_id') {
      // Zimbabwean ID: 9 digits
      if (!/^\d{9}$/.test(cleaned)) {
        return {
          isValid: false,
          message: 'Zimbabwean ID must be 9 digits',
          idType: 'national_id',
        };
      }
      return { isValid: true, message: 'Valid Zimbabwean ID', idType: 'national_id' };
    } else if (idType === 'passport') {
      // Zimbabwean Passport: 7 alphanumeric characters
      if (!/^[A-Z0-9]{7}$/.test(cleaned)) {
        return {
          isValid: false,
          message: 'Zimbabwean Passport must be 7 alphanumeric characters',
          idType: 'passport',
        };
      }
      return { isValid: true, message: 'Valid Zimbabwean Passport', idType: 'passport' };
    }
  }

  // Default validation for other countries
  if (idType === 'national_id') {
    // General: 6-20 digits
    if (!/^\d{6,20}$/.test(cleaned)) {
      return {
        isValid: false,
        message: 'ID must be between 6-20 digits',
        idType: 'national_id',
      };
    }
    return { isValid: true, message: 'Valid ID number', idType: 'national_id' };
  } else {
    // General passport: 6-20 alphanumeric
    if (!/^[A-Z0-9]{6,20}$/.test(cleaned)) {
      return {
        isValid: false,
        message: 'Passport must be between 6-20 alphanumeric characters',
        idType: 'passport',
      };
    }
    return { isValid: true, message: 'Valid Passport number', idType: 'passport' };
  }
};
