use crate::config::ConfigParam;
use chain_core::mempack::{ReadBuf, ReadError, Readable};
use chain_core::property;

#[derive(Debug, Clone, PartialEq, Eq, serde_derive::Serialize, serde_derive::Deserialize)]
pub struct ConfigParams(pub(crate) Vec<ConfigParam>);

impl ConfigParams {
    pub fn new() -> Self {
        ConfigParams(Vec::new())
    }

    pub fn push(&mut self, config: ConfigParam) {
        self.0.push(config)
    }

    pub fn iter(&self) -> std::slice::Iter<ConfigParam> {
        self.0.iter()
    }
}

impl property::Serialize for ConfigParams {
    type Error = std::io::Error;
    fn serialize<W: std::io::Write>(&self, mut writer: W) -> Result<(), Self::Error> {
        // FIXME: put params in canonical order (e.g. sorted by tag)?
        use chain_core::packer::*;
        Codec::new(&mut writer).put_u16(self.0.len() as u16)?;
        for config in &self.0 {
            config.serialize(&mut writer)?
        }
        Ok(())
    }
}

impl Readable for ConfigParams {
    fn read<'a>(buf: &mut ReadBuf<'a>) -> Result<Self, ReadError> {
        // FIXME: check canonical order?
        let len = buf.get_u16()?;
        let mut configs = vec![];
        for _ in 0..len {
            configs.push(ConfigParam::read(buf)?);
        }
        Ok(ConfigParams(configs))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use quickcheck::{Arbitrary, Gen, TestResult};

    quickcheck! {
        fn initial_ents_serialization_bijection(b: ConfigParams) -> TestResult {
            property::testing::serialization_bijection_r(b)
        }
    }

    impl Arbitrary for ConfigParams {
        fn arbitrary<G: Gen>(g: &mut G) -> Self {
            let size = u8::arbitrary(g) as usize;
            ConfigParams(
                std::iter::repeat_with(|| ConfigParam::arbitrary(g))
                    .take(size)
                    .collect(),
            )
        }
    }
}
